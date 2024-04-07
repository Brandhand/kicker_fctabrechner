// ==UserScript==
// @name          Tabellenrechner 2024
// @description   Tabellenrechner 2024
// @version       240403.2
//
// @match         https://www.kicker.de/bundesliga/tabellenrechner
//
// @grant  GM_addStyle
// ==/UserScript==

/*global console */

const dqS = document.querySelector.bind(document);
const dqSA = document.querySelectorAll.bind(document);

GM_addStyle("div.kick__data-grid__side > div { position: fixed; bottom: 2em; }");
GM_addStyle("div[data-bind='foreach: rounds'] > div:nth-child(2n) { background-color: #ccc; }");
GM_addStyle("div.kick__card-headline-action-box.kick__module-margin { display: none; }");
GM_addStyle("div.kick__pagination.kick__pagination--padding { display: none; }");
GM_addStyle(".kick__table--gamelist tr:nth-child(2n) td { background-color: inherit; }");
GM_addStyle("footer { display: none; }");
GM_addStyle(".kick__ad__taboola { display: none; }");

let turnVisible = false;
waitForElement("div[data-bind='foreach: rounds'] > div:nth-child(34)", () => {
  dqSA("div[data-bind='foreach: rounds'] > div").forEach(el => {
    if (!turnVisible && !el.checkVisibility()) {
      el.remove();
    }

    if (!turnVisible && el.checkVisibility()) {
      turnVisible = true;
      el.style.border = 'solid 3px';
      checkForTeams(el);
    }

    if (turnVisible && !el.checkVisibility()) {
      el.style.display = 'block';
      el.style.border = 'solid 3px';
      checkForTeams(el);
    }
  });
  dqSA("table.kick__table.kick__table--ranking.kick__table--small.kick__table--calculator tbody tr").forEach(tr => {
    if (!tr.innerHTML.match('Köln|Bochum|Mainz|Darmstadt')) {
      tr.remove();
    }
  });
});

function checkForTeams(el) {
  el.querySelectorAll('table tr').forEach(tr => {
    if (!tr.innerHTML.match('Köln|Bochum|Mainz|Darmstadt')) {
      tr.remove();
    }
  });
}

function waitForElement(readySelector, callback) {
  let numAttempts = 0;
  const tryNow = function() {
    const elem = document.querySelector(readySelector);
    if (elem) {
      callback(elem);
    } else {
      numAttempts++;
      if (numAttempts >= 10) {
        // alert('GM: Couldnt find last commit date');
        console.warn('Giving up after 10 attempts. Could not find: ' + readySelector);
      } else {
        setTimeout(tryNow, 250); // * Math.pow(1.1, numAttempts));
      }
    }
  };
  tryNow();
}
