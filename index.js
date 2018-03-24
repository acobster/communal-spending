const notify = require('popcornnotify')
const google = require('googleapis')
const googleAuth = require('google-auth-library')

// read our Google/house config files
const googlePrivateKey = require('./google-service-account-credentials.json')
const config = require('./config.json')



/* DO THE THING */
initClient(sendSpendingNotifications)



function sendSpendingNotifications(oauth) {
  getSpending(oauth, compileReports)
}


function compileReports(spending) {
  const debts = config.people.reduce((debts, debtor) => {
    Object.keys(debtor.owes).forEach((creditor) => {
      // find the X,Y coords in the value set:
      // X coord is the first value in the config array...
      const COLUMN = debtor.owes[creditor][0]
      // ...Y coord is the second
      const ROW = debtor.owes[creditor][1]

      const debt = parseFloat(spending[COLUMN][ROW])
      if (debt > 0) {
        debts.push({creditor: creditor, amount: debt, debtor: debtor.name})
      }
    })

    //let message = 'Tripoli spending report for ' + debtor.name + ":\n\n"
    //  + oweLines.join("\n")

    //notify(debtor.contact, message)
    return debts
  }, [])

  config.people.forEach(receiver => {
    const details = debts.reduce((details, debt) => {
      if (debt.debtor === receiver.name) {
        details.push('You owe '+debt.creditor+' $'+debt.amount.toFixed(2))
      } else if (debt.creditor === receiver.name) {
        details.push(debt.debtor+' owes you $'+debt.amount.toFixed(2))
      }

      return details
    }, []);

    const heading = config.heading || 'Spending report for %name%:';

    const message = [
      heading.replace('%name%', receiver.name),
      '',
      details.join("\n")
    ].join("\n");

    notify(receiver.contact, message)
  })
}


function getSpending(oauth, done, notifyPerson) {
  const sheets = google.sheets('v4')
  const range = sheets.spreadsheets.values.get({
    auth: oauth,
    spreadsheetId: config.google.fileId,
    range: config.google.range,
  }, function(err, spending) {
    if (!err) {
      done(spending.values)
    }
  })
}


function initClient(onReady) {

  // init client with private key
  const oauth = new (new googleAuth).OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      '/')
  const client = new google.auth.JWT(
      googlePrivateKey.client_email,
      null,
      googlePrivateKey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']);

  // authorize client
  client.authorize(function(err, result) {
    if (err) {
      console.log(err)
      return
    } else {
      oauth.credentials = result
      onReady(oauth)
    }
  })

}


