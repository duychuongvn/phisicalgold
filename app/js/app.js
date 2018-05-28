// Import the page's CSS. Webpack will know what to do with it.
import "../css/app.css";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import artifacts from '../../build/contracts/PhisicalGold.json'

// PhisicalGold is our usable abstraction, which we'll use through the code below.
var PhisicalGold = contract(artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var goldTable;
window.App = {
  start: function() {
    var self = this;
    // Bootstrap the MetaCoin abstraction for Use.
    PhisicalGold.setProvider(web3.currentProvider);
    goldTable = document.getElementById("goldlist");

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.loadGolds();
    });

  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;


    PhisicalGold.deployed().then(function(instance) {
      return instance.balanceOf.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  loadGolds: function() {
    var self = this;


    var table  = $("#goldlist");
    var tbody  = $("#tbodyId");
    tbody.empty();
    table.children()
    var goldInstance;
    PhisicalGold.deployed().then(function(instance) {
      goldInstance = instance;

      // Execute adopt as a transaction by sending account
      return goldInstance.totalSupply.call({from: account});
    }).then(function(result) {
      var totalSupply = result.valueOf();
      for(var i =0;i<totalSupply; i++) {
         self.getGoldId(i);


      }
    }).catch(function(err) {
      console.log(err.message);
      self.setStatus("Send gold error: " + err.message);
    });

  },

  getOwner: function(goldId) {
    var self = this;
    var table  = $("#goldlist");
    var tbody  = $("#tbodyId");
    PhisicalGold.deployed().then(function(instance) {
      return instance.ownerOf.call(goldId, {from: account});
    }).then(function (result) {
      var owner = result.valueOf();

      tbody.append("<tr><td>")
      tbody.append(goldId);

      tbody.append("</td><td>")
      tbody.append(owner);

      tbody.append("</td></tr>")

    }).catch(function (err) {
      console.log(err);
    })
  },

  getGoldId: function(index) {
    var self = this;
    PhisicalGold.deployed().then(function(instance) {

      return instance.tokenByIndex.call(index, {from: account});
    }).then(function (result) {
      var goldId = result.valueOf();
      var owner = self.getOwner(goldId);

    }).catch(function (err) {
      console.log(err);
    })
  },
  sendGold: function() {

    var self = this;

    var goldInstance;
    var toAddress = document.getElementById("receiver").value;
    var goldid = parseInt(document.getElementById("goldid").value);
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      PhisicalGold.deployed().then(function(instance) {
        goldInstance = instance;

        // Execute adopt as a transaction by sending account
        return goldInstance.safeTransferFrom(account,toAddress,goldid,"", {from: account});
      }).then(function(result) {
        self.setStatus("Send gold successful");
        self.loadGolds();
      }).catch(function(err) {
        console.log(err.message);
        self.setStatus("Send gold error: " + err.message);
      });
    });
  },
  mint: function () {

    var self = this

    var goldInstance
    var goldid = parseInt(document.getElementById('newgoldid').value)
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error)
      }

      var account = accounts[0]

      PhisicalGold.deployed().then(function (instance) {
        goldInstance = instance

        // Execute adopt as a transaction by sending account
        return goldInstance.mint(goldid, '', { from: account })
      }).then(function (result) {
        self.setStatus('Mint gold successful')
        self.loadGolds()
      }).catch(function (err) {
        console.log(err.message)
        self.setStatus('Mint gold error: ' + err.message)
      })
    })

  }

};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
