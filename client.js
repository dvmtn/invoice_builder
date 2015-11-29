(function(){
  var pdf = require('html-pdf');
  var remote = require('remote'); 
  var dialog = remote.require('dialog'); 

  var input_names = [
    'invoice_id',
    'date',
    'client_name',
    'client_address',
    'work_description',
    'excl_vat_price',
    'payment_days'
  ];

  var print_to_pdf = function(filename, html){
    dialog.showSaveDialog({
      defaultPath: window.config.invoice_directory + filename,
      filters: [
        { name: 'Documents', extensions: ['pdf'] },
      ]
    }, function(filename){
      if(filename){
        pdf.create(html).toFile(filename,function(err, res){
          console.log(res.filename);
        });
      }
    });
  };

  var by_id = function(name){
    return document.getElementById(name);
  };

  var prefill_days_select = function(){
    by_id('payment_days_input').innerHTML = window.config.payment_day_options.map(function(number){
      return "<option value='" + number + "'>pay within " + number + " days</option>";
    }).join('\n');
  };

  var insert_secret_details = function(){
    var fields = window.config.fields;
    for(var info in fields){
      var value = fields[info];
      var elements = document.getElementsByClassName(info);
      if(elements.length > 0){
        for(var i=0, l=elements.length; i<l; i++){
          elements[i].innerHTML = (value instanceof Array)? value.join(', ') : value;
        }
      }else{
        alert("Cannot find field \'"+ info +"\' to insert data into. Check the key name in config.js");
      }
    }
  };

  var insert_logo = function(src){
    if(src){
      var logo = by_id('logo');
      logo.style.display = 'inline-block';
      logo.setAttribute('src', src);
    }
  };

  var get_values = function(){
    return input_names.reduce(function(values, name){
      values[name] = get_value(name);
      return values;
    }, {});
  };

  var get_value = function(name){
    return by_id( name+ '_input').value;
  };

  var add_vat = function(values){
    values.excl_vat_price = parseInt(values.excl_vat_price);
    values.incl_vat_price = values.excl_vat_price * 1.2;
    values.vat_charged = values.excl_vat_price * 0.2;
    return values;
  };

  var render = function(values){
    for(var name in values){
      by_id(name).innerHTML = values[name];
    }
    insert_logo(window.config.logo);
  };

  var process_form = function(event){
    event.preventDefault();
    var values = add_vat(get_values());
    render(values);
    print_to_pdf(values.invoice_id + ".pdf", document.documentElement.innerHTML);
  };

  var init = function(){
    prefill_days_select();
    insert_secret_details();
    by_id('invoice_data').addEventListener('submit', process_form, false);
  };

  window.addEventListener('load', init, false);

})();
