//Configuring Firebase application
var config = {
  apiKey: "AIzaSyBuBrpKvwMMnMJWjGf4UsJFZPYGaiVm250",
  authDomain: "fir-js-13ecc.firebaseapp.com",
  databaseURL: "https://fir-js-13ecc.firebaseio.com",
  projectId: "fir-js-13ecc",
  storageBucket: "fir-js-13ecc.appspot.com",
  messagingSenderId: "218732343795"
};
firebase.initializeApp(config);

var currentuseremail = ""; // a global variable to store current user emil ID
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    currentuseremail = user.email;
    //Allow only authenticated user to view data
    if (user.email == "gopalfireworks@gmail.com") {
      //Show sidebar,feture div & hide login screen
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";
      document.getElementById("noaccessdiv").style.display = //
      "none";
    } else {
      //Hide all show no worker access DIV
      console.log("Wrong authentication");
      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "none";
      document.getElementById("noaccessdiv").style.display = "block";

    }

    var user = firebase.auth().currentUser;
    if (user != null) {
      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Hi " + email_id;
      console.log(user);
    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});
//Login function
function login() {

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;

    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });

}
//Logout function
function logout() {
  firebase.auth().signOut();
  document.getElementById("noaccessdiv").style.display = "none";
}

var database = firebase.database(); //Get database reference
//Load all customer data
function loadcustomer() {
  //Only admin can see customer data
  if (currentuseremail == "gopalfireworks@gmail.com") {
    database.ref('customers').on('child_added', function(data) {
      add_data_table(data.val().customername, data.val().customertype, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
    });
    database.ref('customers').on('child_changed', function(data) {
      update_data_table(data.val().customername, data.val().customertype, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
    });
    database.ref('customers').on('child_removed', function(data) {
      remove_data_table(data.key)
    }); //Worker cant see customer data
  } else {
    console.log("In load customer you are not authorised to see " + currentuseremail);
  }

}
//Add entered data to customer table in HTML
function add_data_table(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  $("#custable").prepend('<tr id="' + phonenumber + '"><th>' + customername + '</th><th>' + customertype + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th></tr>');
}
//Update entered data to customer table in HTML
function update_data_table(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  $("#custable #" + phonenumber).html('<th>' + customername + '</th><th>' + customertype + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th>');
}
//Remove desired data from customer table in HTML
function remove_data_table(phonenumber) {
  $("#custable #" + phonenumber).remove();
}
/**DB operations for Customer **/
//new customer data
function new_data(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  if (currentuseremail == "gopalfireworks@gmail.com") {
    database.ref('customers/' + phonenumber).set({
      customername: customername,
      customertype: customertype,
      phonenumber: phonenumber,
      whatsappnumber: whatsappnumber,
      address: address,
      pincode: pincode,
      email: email
    });
  } else {
    console.log("triggered");
  }

}
//Update customer data
function update_data(customername, customertype, phonenumber, whatsappnumber, address, pincode, email, key) {
  database.ref('customers/' + phonenumber).update({
    customername: customername,
    customertype: customertype,
    phonenumber: phonenumber,
    whatsappnumber: whatsappnumber,
    address: address,
    pincode: pincode,
    email: email
  });
}
$("#btnAdd").click(function() {
  $("#txtcustomerName").val("");
  $("#txtcustomerType").val("");
  $("#txtPhoneNumber").val("");
  $("#txtWhatsappNumber").val("");
  $("#txtAddress").val("");
  $("#txtPincode").val("");
  $("#txtEmail").val("");
  $("#txtType").val("N");
  $("#txtKey").val("0");
  $("#modal").addClass("is-active");
});
$("#btnSave").click(function() {
  if ($("#txtType").val() == 'N') {
    database.ref('customers').once("value").then(function(snapshot) {
      new_data($("#txtcustomerName").val(), $("#txtcustomerType").val(), $("#txtPhoneNumber").val(), $("#txtWhatsappNumber").val(), $("#txtAddress").val(), $("#txtPincode").val(), $("#txtEmail").val(), $("#txtPhoneNumber").val());
    });
  } else {
    update_data($("#txtcustomerName").val(), $("#txtcustomerType").val(), $("#txtPhoneNumber").val(), $("#txtWhatsappNumber").val(), $("#txtAddress").val(), $("#txtPincode").val(), $("#txtEmail").val(), $("#txtPhoneNumber").val());
  }
  $("#txtPhoneNumber").prop("readonly", false);
  $("#btnClose").click();
});
$(document).on("click", ".btnEdit", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  $("#txtPhoneNumber").prop("readonly", true);
  database.ref('customers/' + key).once("value").then(function(snapshot) {
    $("#txtcustomerName").val(snapshot.val().customername);
    $("#txtcustomerType").val(snapshot.val().customertype);
    $("#txtPhoneNumber").val(snapshot.val().phonenumber);
    $("#txtWhatsappNumber").val(snapshot.val().whatsappnumber);
    $("#txtAddress").val(snapshot.val().address);
    $("#txtPincode").val(snapshot.val().pincode);
    $("#txtEmail").val(snapshot.val().email);
    $("#txtType").val("E");
    $("#txtKey").val(key);
  });
  $("#modal").addClass("is-active");
});
$(document).on("click", ".btnRemove", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('customers/' + key).remove();
})
$("#btnClose,.btnClose").click(function() {
  $("#modal").removeClass("is-active");
});
/*************seller management***************/
function loadseller() {
  database.ref('sellers').on('child_added', function(data) {
    add_seller_data_table(data.val().sellername, data.val().companyname, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);

  });
  database.ref('sellers').on('child_changed', function(data) {
    update_seller_data_table(data.val().sellername, data.val().companyname, data.val().phonenumber, data.val().whatsappnumber, data.val().address, data.val().pincode, data.val().email, data.key);
  });
  database.ref('sellers').on('child_removed', function(data) {
    remove_seller_data_table(data.key)
  });
}

function add_seller_data_table(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  $("#sellertable").prepend('<tr id="' + phonenumber + '"><th>' + sellername + '</th><th>' + companyname + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th></tr>');
}

function update_seller_data_table(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  $("#sellertable #" + phonenumber).html('<th>' + sellername + '</th><th>' + companyname + '</th><th>' + phonenumber + '</th><th>' + whatsappnumber + '</th><th>' + address + '</th><th>' + pincode + '</th><th>' + email + '</th><th><a href="#" data-key="' + phonenumber + '" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="' + phonenumber + '">Remove</a></th>');
}

function remove_seller_data_table(phonenumber) {
  $("#sellertable #" + phonenumber).remove();
}

function new_seller_data(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, phonenumber) {
  database.ref('sellers/' + phonenumber).set({
    sellername: sellername,
    companyname: companyname,
    phonenumber: phonenumber,
    whatsappnumber: whatsappnumber,
    address: address,
    pincode: pincode,
    email: email
  });
}

function update_seller_data(sellername, companyname, phonenumber, whatsappnumber, address, pincode, email, key) {
  database.ref('sellers/' + phonenumber).update({
    sellername: sellername,
    companyname: companyname,
    phonenumber: phonenumber,
    whatsappnumber: whatsappnumber,
    address: address,
    pincode: pincode,
    email: email
  });
}
$("#btnSellerAdd").click(function() {
  $("#txtSellerName").val("");
  $("#txtSellerCompanyName").val("");
  $("#txtSellerPhoneNumber").val("");
  $("#txtSellerWhatsappNumber").val("");
  $("#txtSellerAddress").val("");
  $("#txtSellerPincode").val("");
  $("#txtSellerEmail").val("");
  $("#txtSellerType").val("N");
  $("#txtSellerKey").val("0");
  $("#modal").addClass("is-active");
});
$("#btnSellerSave").click(function() {
  if ($("#txtSellerType").val() == 'N') {
    database.ref('sellers').once("value").then(function(snapshot) {
      new_seller_data($("#txtSellerName").val(), $("#txtSellerCompanyName").val(), $("#txtSellerPhoneNumber").val(), $("#txtSellerWhatsappNumber").val(), $("#txtSellerAddress").val(), $("#txtSellerPincode").val(), $("#txtSellerEmail").val(), $("#txtSellerPhoneNumber").val());
    });
  } else {
    update_seller_data($("#txtSellerName").val(), $("#txtSellerCompanyName").val(), $("#txtSellerPhoneNumber").val(), $("#txtSellerWhatsappNumber").val(), $("#txtSellerAddress").val(), $("#txtSellerPincode").val(), $("#txtSellerEmail").val(), $("#txtSellerPhoneNumber").val());
  }
  $("#btnSellerClose").click();
});
$(document).on("click", ".btnEdit", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('sellers/' + key).once("value").then(function(snapshot) {
    $("#txtSellerName").val(snapshot.val().sellername);
    $("#txtSellerCompanyName").val(snapshot.val().companyname);
    $("#txtSellerPhoneNumber").val(snapshot.val().phonenumber);
    $("#txtSellerWhatsappNumber").val(snapshot.val().whatsappnumber);
    $("#txtSellerAddress").val(snapshot.val().address);
    $("#txtSellerPincode").val(snapshot.val().pincode);
    $("#txtSellerEmail").val(snapshot.val().email);
    $("#txtSellerType").val("E");
    $("#txtSellerKey").val(key);
  });
  $("#modal").addClass("is-active");
});
$(document).on("click", ".btnRemove", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('sellers/' + key).remove();
})
$("#btnSellerClose,.btnSellerClose").click(function() {
  $("#modal").removeClass("is-active");
});
/*******seller management ends************/
//showcategorydata
var categoryarray = [];
var subcategoryarray = [];
var companynames = [];
var itemcodes = [];
var currentunitconfig = "";
function showcategorydata(name, type) {
  if (type == "Category") {
    categoryarray.push(name);
  } else if (type == "Sub-Category") {
    subcategoryarray.push(name);
  }
}
function showcompanyname(name) {
  companynames.push(name);
}
function showitemcodes(code) {
  itemcodes.push(code);
}
function getunitconfig(unit) {
  currentunitconfig = unit;
}
database.ref('categories').on('child_added', function(data) {
  showcategorydata(data.val().name, data.val().type);
});
database.ref('sellers').on('child_added', function(data) {
  showcompanyname(data.val().companyname);
});
database.ref('products').on('child_added', function(data) {
  showitemcodes(data.val().itemcode);
});
function returnCurrentUnit() {
  $('#showunitsdiv').empty();
  database.ref('products').on('child_added', function(data) {
    var itemcode = $("#itemcode").val();
    if (data.val().itemcode == itemcode) {
      getunitconfig(data.val().unit);
    }
  });
  if (currentunitconfig == "Case-Tin") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Tin: <input id="tin" type="text" placeholder="Tin"/>');
  } else if (currentunitconfig == "Case-Piece") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Piece: <input id="piece" type="text" placeholder="Piece"/>');
  } else if (currentunitconfig == "Case-Box-Piece") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Box: <input id="box" type="text" placeholder="Box"/> Piece: <input id="piece" type="text" placeholder="Piece"/>');
  } else if (currentunitconfig == "Case-Packets") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Packets: <input id="packets" type="text" placeholder="Packets"/>');
  } else if (currentunitconfig == "Bundle-Katta-Boxes") {

    $("#showunitsdiv").append('Bundle: <input id="bundle" type="text" placeholder="Bundle"/> Katta: <input id="katta" type="text" placeholder="Katta"/>Box: <input id="box" type="text" placeholder="Box"/>');
  } else if (currentunitconfig == "Bundle-Boxes") {

    $("#showunitsdiv").append('Bundle: <input id="bundle" type="text" placeholder="Bundle"/> Box: <input id="box" type="text" placeholder="Box"/>');
  } else if (currentunitconfig == "Bag-Kgs") {

    $("#showunitsdiv").append('Bag: <input id="bag" type="text" placeholder="Bag"/> Kgs: <input id="kgs" type="text" placeholder="Kgs"/>');
  } else if (currentunitconfig == "Case-Cent-Katta") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Cent: <input id="cent" type="text" placeholder="Cent"/> Katta: <input id="katta" type="text" placeholder="Katta"/>');
  } else if (currentunitconfig == "Case-Tube") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Tube: <input id="tube" type="text" placeholder="Tube"/>');
  } else if (currentunitconfig == "Case-Cone") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Cone: <input id="cone" type="text" placeholder="Cone"/>');
  } else if (currentunitconfig == "Bag-Pieces") {

    $("#showunitsdiv").append('Bag: <input id="bag" type="text" placeholder="Bag"/> Piece: <input id="piece" type="text" placeholder="Piece"/>');
  } else if (currentunitconfig == "Bag-Packets") {

    $("#showunitsdiv").append('Bag: <input id="bag" type="text" placeholder="Bag"/> Packets: <input id="packets" type="text" placeholder="Packets"/>');
  } else {
    $("#showunitsdiv").append('<h1>Issue in selection</h1>');
  }
  //$("#showunitsdiv").append('<h1>'+currentunitconfig+'</h1>')
  console.log($("#itemcode").val() + " " + currentunitconfig);
}
/* Autocomplete */
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /* execute a function when someone writes in the text field: */
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /* close any already open lists of autocompleted values */
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /* create a DIV element that will contain the items (values): */
    /* document.getElementById('autocompletetagshere').appendChild("DIV"); */

    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /* append the DIV element as a child of the autocomplete container: */
    document.getElementById('autocompletetagshere').appendChild(a);
    /* for each item in the array... */
    for (i = 0; i < arr.length; i++) {
      /* check if the item starts with the same letters as the text field value: */
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /* create a DIV element for each matching element: */
        b = document.createElement("DIV");
        /* make the matching letters bold: */
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /* insert a input field that will hold the current array item's value: */
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /* execute a function when someone clicks on the item value (DIV element): */
        b.addEventListener("click", function(e) {
          /* insert the value for the autocomplete text field: */
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /* execute a function presses a key on the keyboard: */
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x)
      x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /* and and make the current item more visible: */
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /* and and make the current item more visible: */
      addActive(x);
    } else if (e.keyCode == 13) {
      /* If the ENTER key is pressed, prevent the form from being submitted, */
      e.preventDefault();
      if (currentFocus > -1) {
        /* and simulate a click on the "active" item: */
        if (x)
          x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /* a function to classify an item as "active": */
    if (!x)
      return false;

    /* start by removing the "active" class on all items: */
    removeActive(x);
    if (currentFocus >= x.length)
      currentFocus = 0;
    if (currentFocus < 0)
      currentFocus = (x.length - 1);

    /* add class "autocomplete-active": */
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /* a function to remove the "active" class from all autocomplete items: */
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /* execute a function when someone clicks in the document: */
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
database.ref('categories').on('child_added', function(data) {
  add_categories_data_table(data.val().name, data.val().type);
});
database.ref('categories').on('child_changed', function(data) {
  update_categories_data_table(data.val().name, data.val().type);
});
database.ref('categories').on('child_removed', function(data) {
  remove_categories_data_table(data.key)
});

function add_categories_data_table(name, type) {
  $("#Catcustable").prepend('<tr id="' + name + '"><th>' + name + '</th><th>' + type + '</th><th><a href="#" data-key="' + name + '" class="card-footer-item btnCatEdit">Edit</a></th><th><a href="#" class="card-footer-item btnCatRemove"  data-key="' + name + '">Remove</a></th></tr>');
}
function update_categories_data_table(name, type) {
  $("#Catcustable #" + name).html('<th>' + name + '</th><th>' + type + '</th><th><a href="#" data-key="' + name + '" class="card-footer-item btnCatEdit">Edit</a></th><th><a href="#" class="card-footer-item btnCatRemove"  data-key="' + name + '">Remove</a></th>');
}
function remove_categories_data_table(name) {
  $("#Catcustable #" + name).remove();
}
function new_data(name, type) {
  database.ref('categories/' + name).set({name: name, type: type});
}
function update_data(name, type) {
  database.ref('categories/' + name).update({name: name, type: type});
  console.log(name);
}
$("#btnCatAdd").click(function() {});

$("#btnCatSave").click(function() {
  if ($("#txtType").val() == 'N') {
    database.ref('categories').once("value").then(function(snapshot) {

      new_data($("#txtCatname").val(), $("#txtCattype").val());
    });
  } else {
    update_data($("#txtCatname").val(), $("#txtCattype").val());
    //window.location.reload();
  }
});
$(document).on("click", ".btnCatEdit", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  console.log("key is " + key);
  database.ref('categories/' + key).once("value").then(function(snapshot) {
    $("#txtCatname").val(snapshot.val().name);
    $("#txtCattype").val(snapshot.val().type);
  });
});
$(document).on("click", ".btnCatRemove", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('categories/' + key).remove();
})
/********Add products logic****/
database.ref('products').on('child_added', function(data) {
  add_products_data_table(data.val().name, data.val().itemcode, data.val().companyname, data.val().category, data.val().subcategory, data.val().unit, data.val().comment);
});
database.ref('products').on('child_changed', function(data) {
  update_products_data_table(data.val().name, data.val().itemcode, data.val().companyname, data.val().category, data.val().subcategory, data.val().unit, data.val().comment);
  updateConfigProductTableInstantly(data);

});

database.ref('products').on('child_removed', function(data) {
  remove_products_data_table(data.key)
});

function add_products_data_table(name, itemcode, companyname, category, subcategory, unit, comment) {
  $("#ProductTable").prepend('<tr id="' + itemcode + '"><th>' + name + '</th><th>' + itemcode + '</th><th>' + companyname + '</th><th>' + category + '</th><th>' + subcategory + '</th><th>' + unit + '</th><th>' + comment + '</th><th><a href="#" data-key="' + itemcode + '" class="card-footer-item btnProductEdit">Edit</a></th><th><a href="#" class="card-footer-item btnProductRemove"  data-key="' + itemcode + '">Remove</a></th></tr>');
}
function update_products_data_table(name, itemcode, companyname, category, subcategory, unit, comment) {
  $("#ProductTable #" + itemcode).html('<th>' + name + '</th><th>' + itemcode + '</th><th>' + companyname + '</th><th>' + category + '</th><th>' + subcategory + '</th><th>' + unit + '</th><th>' + comment + '</th><th><a href="#" data-key="' + itemcode + '" class="card-footer-item btnProductEdit">Edit</a></th><th><a href="#" class="card-footer-item btnProductRemove"  data-key="' + itemcode + '">Remove</a></th>');
}
function remove_products_data_table(itemcode) {
  $("#ProductTable #" + itemcode).remove();
}
function new_product_data(name, itemcode, companyname, category, subcategory, unit, comment) {
  database.ref('products/' + itemcode).set({
    name: name,
    itemcode: itemcode,
    companyname: companyname,
    category: category,
    subcategory: subcategory,
    unit: unit,
    comment: comment
  });

}
function update_product_data(name, itemcode, companyname, category, subcategory, unit, comment) {
  database.ref('products/' + itemcode).update({
    name: name,
    itemcode: itemcode,
    companyname: companyname,
    category: category,
    subcategory: subcategory,
    unit: unit,
    comment: comment
  });
}
$("#btnProductAdd").click(function() {});

$("#btnProductSave").click(function() {
  if ($("#txtType").val() == 'N') {
    database.ref('products').once("value").then(function(snapshot) {
      new_product_data($("#productname").val(), $("#itemcode").val(), $("#companynameInput").val(), $("#categoriesInput").val(), $("#subcategoriesInput").val(), $("#unitconversion").val(), $("#itemcomment").val());
    });
    $("#productname").val("");
    $("#itemcode").val("");
    $("#companynameInput").val("");
    $("#categoriesInput").val("");
    $("#subcategoriesInput").val("");
    $("#unitconversion").val("");
    $("#itemcomment").val("");
  } else {

    update_product_data($("#productname").val(), $("#itemcode").val(), $("#companynameInput").val(), $("#categoriesInput").val(), $("#subcategoriesInput").val(), $("#unitconversion").val(), $("#itemcomment").val());
    //window.location.reload();
    $("#productname").val("");
    $("#itemcode").val("");
    $("#companynameInput").val("");
    $("#categoriesInput").val("");
    $("#subcategoriesInput").val("");
    $("#unitconversion").val("");
    $("#itemcomment").val("");
  }
});
$(document).on("click", ".btnProductEdit", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  console.log("key is " + key);
  database.ref('products/' + key).once("value").then(function(snapshot) {
    $("#productname").val(snapshot.val().name);
    $("#itemcode").val(snapshot.val().itemcode);
    $("#companynameInput").val(snapshot.val().companyname);
    $("#categoriesInput").val(snapshot.val().category);
    $("#subcategoriesInput").val(snapshot.val().subcategory);
    $("#unitconversion").val(snapshot.val().unit);
    $("#itemcomment").val(snapshot.val().comment);
  });
});
$(document).on("click", ".btnProductRemove", function(event) {
  event.preventDefault();
  key = $(this).attr("data-key");
  database.ref('products/' + key).remove();
})
/***Add product logic ends*/
/** configure product logic starts here **/
function updateConfigProductTableInstantly(data) {
  console.log("UCPTI" + data.val().category);
  switch (data.val().unit) {
    case "Case-Box-Piece":
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Box: ' + data.val().box + ' Piece: ' + data.val().piece + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');

      } else {
        add_config_product_CaseBoxPiece_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().box, data.val().piece, data.val().itemcode);
      }
      break;
    case "Case-Piece":
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Piece: ' + data.val().piece + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        console.log("table row " + data.val().itemcode);
        add_config_product_CasePiece_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().piece, data.val().itemcode);
      }
      console.log("its c-p");
      break;
    case "Case-Packets":
      console.log("its c-pkts");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Packets: ' + data.val().packets + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');

      } else {
        add_config_product_CasePackets_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().packets, data.val().itemcode);
      }
      break;
    case "Case-Tin":
      console.log("its c-t");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Tin: ' + data.val().tin + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_CaseTin_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().tin, data.val().itemcode);
      }
      break;
    case "Bundle-Katta-Boxes":
      console.log("its b-k-b");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Bundle: ' + data.val().bundle + ' Katta: ' + data.val().katta + ' Box: ' + data.val().box + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_BundleKattaBox_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bundle, data.val().katta, data.val().box, data.val().itemcode);
      }
      break;
    case "Bundle-Boxes":
      console.log("its b-b");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Bundle: ' + data.val().bundle + ' Box: ' + data.val().box + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');

      } else {
        add_config_product_BundleBox_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bundle, data.val().box, data.val().itemcode);

      }
      break;
    case "Bag-Kgs":
      console.log("its bag-kgs");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Bag: ' + data.val().bag + ' Kgs: ' + data.val().kgs + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_BagKgs_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().kgs, data.val().itemcode);
      }
      break;
    case "Case-Cent-Katta":
      console.log("Its c-c-k");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Cent: ' + data.val().cent + ' Katta: ' + data.val().katta + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_CaseCentKatta_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().cent, data.val().katta, data.val().itemcode);
      }
      break;
    case "Case-Tube":
      console.log("its c-tb");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Tube: ' + data.val().tube + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_CaseTube_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().tube, data.val().itemcode);
      }
      break;
    case "Case-Cone":
      console.log("its c-c");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Case: ' + data.val().case + ' Cone: ' + data.val().cone + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');

      } else {
        console.log("table row " + data.val().itemcode);
        add_config_product_CaseCone_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().cone, data.val().itemcode);
      }
      break;
    case "Bag-Packets":
      console.log("its b-pkts");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Bag: ' + data.val().bag + ' Packets: ' + data.val().packets + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');

      } else {
        add_config_product_BagPackets_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().packets, data.val().itemcode);
      }
      break;
    case "Bag-Pieces":
      console.log("its b-pcs");
      if ($('#ProductConfigureTable').find('#' + data.val().itemcode).length > 0) {
        $("#ProductConfigureTable #" + data.val().itemcode).html('<th>' + data.val().itemcode + '</th><th>Bag: ' + data.val().bag + ' Pieces: ' + data.val().piece + '</th><th>' + data.val().price + '</th><th>' + data.val().wholesalepercent + '</th><th>' + data.val().semiwholesalepercent + '</th><th>' + data.val().retailpercent + '</th>');
      } else {
        add_config_product_BagPieces_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().piece, data.val().itemcode);
      }
      break;
    default:
      console.log("No package found");
  }
}
$("#btnProductConfigSave").click(function() {
  switch (currentunitconfig) {
    case "Case-Box-Piece":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CaseBoxPiece($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#box").val(), $("#piece").val(), $("#itemcode").val());
      });

      break;
    case "Case-Piece":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CasePiece($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#piece").val(), $("#itemcode").val());
      });
      break;
    case "Case-Packets":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CasePackets($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#packets").val(), $("#itemcode").val());
      });
      break;
    case "Case-Tin":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CaseTin($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#tin").val(), $("#itemcode").val());
      });
      break;
    case "Bundle-Katta-Boxes":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_BundleKattaBox($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#bundle").val(), $("#katta").val(), $("#box").val(), $("#itemcode").val());
      });
      break;
    case "Bundle-Boxes":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_BundleBox($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#bundle").val(), $("#box").val(), $("#itemcode").val());
      });
      break;
    case "Bag-Kgs":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_BagKgs($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#bag").val(), $("#kgs").val(), $("#itemcode").val());
      });
      break;
    case "Case-Cent-Katta":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CaseCentKatta($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#cent").val(), $("#katta").val(), $("#itemcode").val());
      });
      break;
    case "Case-Tube":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_CaseTube($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#tube").val(), $("#itemcode").val());
      });
      break;
    case "Case-Cone":
      /*database.ref('products').once("value").then(function(snapshot) {
      new_config_product_CaseCone($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#cone").val(), $("#itemcode").val());
    });*/
      new_config_product_CaseCone($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#cone").val(), $("#itemcode").val());
      //add_config_product_CaseCone_data_table($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#case").val(), $("#cone").val(), $("#itemcode").val());
      //$('#ProductConfigureTable').html(response);
      break;
    case "Bag-Packets":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_BagPackets($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#bag").val(), $("#packets").val(), $("#itemcode").val());
      });
      break;
    case "Bag-Pieces":
      database.ref('products').once("value").then(function(snapshot) {
        new_config_product_BagPieces($("#productconfigprice").val(), $("#wholesalepercent").val(), $("#semiwholesalepercent").val(), $("#retailpercent").val(), $("#bag").val(), $("#piece").val(), $("#itemcode").val());
      });
      break;
    default:
      console.log("No package found");
  }
  //new_productConfig_data($("#productname").val(), $("#itemcode").val(), $("#companynameInput").val(), $("#categoriesInput").val(), $("#subcategoriesInput").val(), $("#unitconversion").val(), $("#itemcomment").val());

});
database.ref('products').on('child_added', function(data) {
  switch (data.val().unit) {
    case "Case-Box-Piece":
      if (data.val().box != undefined) {
        add_config_product_CaseBoxPiece_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().box, data.val().piece, data.val().itemcode);
      }
      break;
    case "Case-Piece":
      console.log("case,piece " + data.val().piece);
      if (data.val().piece != undefined) {
        console.log("in if");
        add_config_product_CasePiece_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().piece, data.val().itemcode);
      }
      break;
    case "Case-Packets":
      if (data.val().packets != undefined) {
        add_config_product_CasePackets_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().packets, data.val().itemcode);
      }
      break;
    case "Case-Tin":
      if (data.val().tin != undefined) {
        add_config_product_CaseTin_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().tin, data.val().itemcode);
      }
      break;
    case "Bundle-Katta-Boxes":
      if (data.val().box != undefined) {
        add_config_product_BundleKattaBox_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bundle, data.val().katta, data.val().box, data.val().itemcode);
      }
      break;
    case "Bundle-Boxes":
      if (data.val().box != undefined) {
        add_config_product_BundleBox_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bundle, data.val().box, data.val().itemcode);
      }
      break;
    case "Bag-Kgs":
      if (data.val().bag != undefined) {
        add_config_product_BagKgs_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().kgs, data.val().itemcode);
      }
      break;
    case "Case-Cent-Katta":
      if (data.val().cent != undefined) {
        add_config_product_CaseCentKatta_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().cent, data.val().katta, data.val().itemcode);
      }
      break;
    case "Case-Tube":
      if (data.val().tube != undefined) {
        add_config_product_CaseTube_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().tube, data.val().itemcode);
      }
      break;
    case "Case-Cone":
      if (data.val().cone != undefined) {
        add_config_product_CaseCone_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().case, data.val().cone, data.val().itemcode);
      }
      break;
    case "Bag-Packets":
      if (data.val().bag != undefined) {
        add_config_product_BagPackets_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().packets, data.val().itemcode);
      }
      break;
    case "Bag-Pieces":
      if (data.val().bag != undefined) {
        add_config_product_BagPieces_data_table(data.val().price, data.val().wholesalepercent, data.val().semiwholesalepercent, data.val().retailpercent, data.val().bag, data.val().piece, data.val().itemcode);
      }
      break;
    default:
      console.log("No package found");
  }
});
function add_config_product_CaseBoxPiece_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, box, piece, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Box : ' + box + ' Piece : ' + piece + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CasePiece_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, piece, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Piece : ' + piece + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CasePackets_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, packets, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Packets : ' + packets + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CaseTin_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, tin, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Tin : ' + tin + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_BundleKattaBox_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, bundle, katta, box, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Bundle : ' + bundle + ' Katta : ' + katta + ' Box : ' + box + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_BundleBox_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, bundle, box, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Bundle : ' + bundle + ' Box : ' + box + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_BagKgs_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, kgs, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Bag : ' + bag + ' Kgs : ' + kgs + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CaseCentKatta_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, cent, katta, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Cent : ' + cent + ' Katta : ' + katta + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CaseTube_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, tube, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Tube : ' + tube + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_CaseCone_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, cone, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Case : ' + caseunit + ' Cone : ' + cone + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_BagPackets_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, packets, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Bag : ' + bag + ' Packets : ' + packets + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}
function add_config_product_BagPieces_data_table(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, piece, itemcode) {
  $("#ProductConfigureTable").prepend('<tr id="' + itemcode + '"><th>' + itemcode + '</th><th>Bag : ' + bag + ' Piece : ' + piece + '</th><th>' + price + '</th><th>' + wholesalepercent + '</th><th>' + semiwholesalepercent + '</th><th>' + retailpercent + '</th></tr>');
}

function new_config_product_CaseBoxPiece(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, box, piece, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    piece: piece,
    box: box
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}

function new_config_product_CasePiece(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, piece, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    piece: piece
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_CasePackets(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, packets, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    packets: packets
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_CaseTin(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, tin, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    tin: tin
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_BundleKattaBox(price, wholesalepercent, semiwholesalepercent, retailpercent, bundle, katta, box, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    bundle: bundle,
    katta: katta,
    box: box
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_BundleBox(price, wholesalepercent, semiwholesalepercent, retailpercent, bundle, box, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    bundle: bundle,
    box: box
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_BagKgs(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, kgs, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    bag: bag,
    kgs: kgs
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_CaseCentKatta(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, centunit, katta, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    katta: katta,
    cent: centunit
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_CaseTube(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, tube, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    tube: tube
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_CaseCone(price, wholesalepercent, semiwholesalepercent, retailpercent, caseunit, cone, itemcode) {

  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    case: caseunit,
    cone: cone
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_BagPackets(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, packets, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    bag: bag,
    packets: packets
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
function new_config_product_BagPieces(price, wholesalepercent, semiwholesalepercent, retailpercent, bag, piece, itemcode) {
  database.ref('products/' + itemcode).update({
    itemcode: itemcode,
    price: price,
    wholesalepercent: wholesalepercent,
    semiwholesalepercent: semiwholesalepercent,
    retailpercent: retailpercent,
    bag: bag,
    piece: piece
  });
  database.ref('inventory/' + itemcode).update({itemcode: itemcode});
}
/** configure product logic ends here **/
/** Add items to inventory starts here**/
function returnCurrentUnitInInv() {
  var itemcode = $("#itemcode").val();
  $('#showunitsdiv').empty();
  database.ref('products').on('child_added', function(data) {

    console.log("IC "+itemcode);
    if (data.val().itemcode == itemcode) {
      console.log("Unt "+data.val().unit);
      getunitconfig(data.val().unit);
    }
  });

  if (currentunitconfig == "Case-Tin") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Tin: <input id="tin" type="text" value="' + snapshot.val().tin + '"placeholder="Tin"/>');
    });
  } else if (currentunitconfig == "Case-Piece") {

    $("#showunitsdiv").append('Case: <input id="case" type="text" placeholder="Case"/> Piece: <input id="piece" type="text" placeholder="Piece"/>');
  } else if (currentunitconfig == "Case-Box-Piece") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Box: <input id="box" type="text" value="' + snapshot.val().box + '"placeholder="Box"/> Piece: <input id="piece" type="text" value="' + snapshot.val().piece + '"placeholder="Piece"/>');
    });
  } else if (currentunitconfig == "Case-Packets") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      if( !snapshot.val()) {
        console.log("Its null yaaaa");
      }
      else{
        $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Packets: <input id="tin" type="text" value="' + snapshot.val().packets + '"placeholder="Tin"/>');
      }
    });
  } else if (currentunitconfig == "Bundle-Katta-Boxes") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Bundle: <input id="bundle" type="text" value="' + snapshot.val().bundle + '"placeholder="Bundle"/> Katta: <input id="katta" type="text" value="' + snapshot.val().katta + '"placeholder="Katta"/>Box: <input id="box" type="text" value="' + snapshot.val().box + '"placeholder="Box"/>');

    });
  } else if (currentunitconfig == "Bundle-Boxes") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Bundle: <input id="bundle" type="text" value="' + snapshot.val().bundle + '"placeholder="Bundle"/> Box: <input id="box" type="text" value="' + snapshot.val().box + '"placeholder="Box"/>');

    });
  } else if (currentunitconfig == "Bag-Kgs") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Bag: <input id="bag" type="text" value="' + snapshot.val().bag + '"placeholder="Bag"/> Kgs: <input id="kgs" type="text" value="' + snapshot.val().kgs + '"placeholder="Kgs"/>');
    });
  } else if (currentunitconfig == "Case-Cent-Katta") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Cent: <input id="cent" type="text" value="' + snapshot.val().cent + '"placeholder="Cent"/> Katta: <input id="katta" type="text" value="' + snapshot.val().katta + '"placeholder="Katta"/>');

    });
  } else if (currentunitconfig == "Case-Tube") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Tube: <input id="tube" type="text" value="' + snapshot.val().tube + '"placeholder="Tube"/>');

    });
  } else if (currentunitconfig == "Case-Cone") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Case: <input id="case" type="text" value="' + snapshot.val().case + '"placeholder="Case"/> Cone: <input id="cone" type="text" value="' + snapshot.val().cone + '"placeholder="Cone"/>');

    });
  } else if (currentunitconfig == "Bag-Pieces") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Bag: <input id="bag" type="text" value="' + snapshot.val().bag + '"placeholder="Bag"/> Piece: <input id="piece" type="text" value="' + snapshot.val().piece + '"placeholder="Piece"/>');

    });
  } else if (currentunitconfig == "Bag-Packets") {
    database.ref('inventory/' + itemcode).once("value").then(function(snapshot) {
      console.log(snapshot.val());
      $("#showunitsdiv").append('Bag: <input id="bag" type="text" value="' + snapshot.val().bag + '"placeholder="Bag"/> Packets: <input id="packets" type="text" value="' + snapshot.val().packets + '"placeholder="Packets"/>');

    });
  } else {
    $("#showunitsdiv").append('<h1>Issue in selection</h1>');
  }
  //$("#showunitsdiv").append('<h1>'+currentunitconfig+'</h1>')
  console.log($("#itemcode").val() + " " + currentunitconfig);
}
$("#btnAddItems").click(function() {
  switch (currentunitconfig) {
    case "Case-Box-Piece":
      add_itemToInv_CaseBoxPiece_data($("#itemcode").val(), $("#case").val(), $("#box").val(), $("#piece").val());
      break;
    case "Case-Piece":
      add_itemToInv_CasePiece_data($("#itemcode").val(), $("#case").val(),$("#piece").val());
      break;
    case "Case-Packets":
      add_itemToInv_CasePackets_data($("#itemcode").val(), $("#case").val(),$("#packets").val());
      break;
    case "Case-Tin":
      add_itemToInv_CaseTin_data($("#itemcode").val(), $("#case").val(),$("#tin").val());
      break;
    case "Bundle-Katta-Boxes":
      add_itemToInv_BundleKattaBox_data($("#itemcode").val(), $("#bundle").val(), $("#katta").val(), $("#box").val());
      break;
    case "Bundle-Boxes":
      add_itemToInv_BundleBox_data($("#itemcode").val(), $("#bundle").val(),$("#box").val());
      break;
    case "Bag-Kgs":
      add_itemToInv_BagKgs_data($("#itemcode").val(), $("#bag").val(),$("#kgs").val());
      break;
    case "Case-Cent-Katta":
      add_itemToInv_CaseCentKatta_data($("#itemcode").val(), $("#case").val(), $("#cent").val(), $("#katta").val());
      break;
    case "Case-Tube":
      add_itemToInv_CaseTube_data($("#itemcode").val(), $("#case").val(),$("#tube").val());
      break;
    case "Case-Cone":
      add_itemToInv_CaseCone_data($("#itemcode").val(), $("#case").val(),$("#cone").val());
      break;
    case "Bag-Packets":
      add_itemToInv_BagPackets_data($("#itemcode").val(), $("#bag").val(),$("#packets").val());break;
    case "Bag-Pieces":
      add_itemToInv_BagPieces_data($("#itemcode").val(), $("#bag").val(),$("#piece").val());
      break;
    default:
      console.log("No package found");
  }

});
function add_itemToInv_CaseBoxPiece_data(itemcode, caseunit, box, piece) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, box: box, piece: piece});
}
function add_itemToInv_CasePiece_data(itemcode, caseunit, piece) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, piece: piece});
}
function add_itemToInv_CasePackets_data(itemcode, caseunit, packets) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, packets: packets});
}
function add_itemToInv_CaseTin_data(itemcode, caseunit, tin) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, tin: tin});
}
function add_itemToInv_BundleKattaBox_data(itemcode, bundle, katta, box) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, bundle: bundle, katta: katta, box: box});
}
function add_itemToInv_BundleBox_data(itemcode, bundle, box) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, bundle: bundle, box: box});
}
function add_itemToInv_BagKgs_data(itemcode, bundle, kgs) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, bag: bag, kgs: kgs});
}
function add_itemToInv_CaseCentKatta_data(itemcode, caseunit, cent, katta) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, katta: katta});
}
function add_itemToInv_CaseTube_data(itemcode, caseunit, tube) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, tube: tube});
}
function add_itemToInv_CaseCone_data(itemcode, caseunit, cone) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, case: caseunit, cone: cone});
}
function add_itemToInv_BagPackets_data(itemcode, bag, packets) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, bag: bag, packets: packets});
}
function add_itemToInv_BagPieces_data(itemcode, bag, piece) {
  database.ref('inventory/' + itemcode).set({itemcode: itemcode, bag: bag, piece: piece});
}
/**Add items to Inventory ends here**/
//Add null cases
