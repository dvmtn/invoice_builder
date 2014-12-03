window.builder = {
  input_names: [
    'invoice_id',
    'date',
    'client_name',
    'client_address',
    'work_description',
    'excl_vat_price'
  ]
};

window.builder.App = function(){
  var by_id = function(id){
    return document.getElementById(id);
  };

  var init = function(){
    bind_ui();
  };

  var bind_ui = function(){
    by_id('invoice_data').addEventListener('submit', process_form, false);
    insert_secret_details();
  };

  var insert_secret_details = function(){
    var config = window.config;
    for(var info in config){
      var value = config[info];
      var elements = document.getElementsByClassName(info);
      if(elements.length > 0){
        for(var i=0, l=elements.length; i<l; i++){
          var el = elements[i];
          if(value instanceof Array){
            value = value.join(', ');
          }
          el.innerHTML = value;
        }
      }else{
        alert("Cannot find id \'"+ id +"\' to insert data into. Check the key name in config.js");
      }
    }
  };

  var add_title = function(title){
    document.getElementsByTagName('title')[0].innerHTML = title;
  };

  var get_values = function(){
    var values = {};
    builder.input_names.forEach(function(name){
      values[name] = get_value(name);
    });
    return values;
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
      var value = values[name];
      by_id(name).innerHTML = value;
    }
  };

  var process_form = function(event){
    event.preventDefault();
    var values = get_values();
    add_title(values.invoice_id);
    var vat_values = add_vat(values);
    render(vat_values);
    window.print();
  };
  init();
};

window.addEventListener('load', function(){
  window.app = new window.builder.App();
}, false);
