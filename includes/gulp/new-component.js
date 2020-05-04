module.exports = function(gulp, fs, arg){
  
  gulp.task("newComponent", function(done) {

    // Private function
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    if (arg.name != undefined) {

      // Default vars
      let component_name = arg.name;
      let comp_dir = "components/" + component_name + "/";
      let all_scss = "assets/scss/util/_components.scss"
      let all_js = "jsx/util/components.js"
      
      // Handle all php
      if (!fs.existsSync(comp_dir)){
        fs.mkdirSync(comp_dir);
      }
      let php_content = $fields = "\<\?php\n"+
      "$fields = array(\n"+
      "	array(\n"+
      "		\"name\"         => \"My Value\",\n"+
      "		\"description\"  => \"Just a sample field.\",\n"+
      "		\"size\"         => \"1\",\n"+
      "		\"type\"         => \"text\",\n"+
      "		\"value\"        => \"\"\n"+
      "	)\n"+
      ")\;\n"+
      "\?\>";
      fs.writeFile(comp_dir + "fields.php", php_content, function(err) {
        if (err) {return console.log(err);}
        console.log("Created fields.php...");
      });
      let ini_content = $fields = "title = "+capitalizeFirstLetter(component_name)+"\n"+
      "slug = "+component_name+"\n"+
      "scope[] = page\n"+
      "scope[] = post";
      fs.writeFile(comp_dir + "info.ini", ini_content, function(err) {
        if (err) {return console.log(err);}
        console.log("Created info.ini...");
      });

      // Handle all scss
      let scss_content = "."+component_name+" {\n"+
      "	background-color: #000000;\n"+
      "}";
      fs.writeFile(comp_dir + "/_style.scss", scss_content, function(err) {
        if (err) {return console.log(err);}
        console.log("Created "+component_name+".scss...");
      });
      let all_scss_content = fs.readFileSync(all_scss, "utf8");
      let updated_scss_content = all_scss_content.replace("\/\/******PlaceNameHere******\/\/", "\,\'..\/..\/..\/components\/"+component_name+"\/style\'\n\/\/******PlaceNameHere******\/\/");
      fs.writeFile(all_scss, updated_scss_content, function(err) {
        if (err) {return console.log(err);}
        console.log("Added to _all.scss...");
      });

      // Handle all js
      let js_content = "import React from 'react';\n\n"+
      "export default class "+capitalizeFirstLetter(component_name)+" extends React.Component {\n\n"+
      "	constructor(props) {\n\n"+
      "		super(props);\n\n"+
      "		this.state = {\n"+
      "			values: (this.props.values ? this.props.values : {\n"+
      "				my_value: \"Default Value\"\n"+
      "			})\n"+
      "		}\n"+
      "	}\n\n"+
      "	render() {\n"+
      "		return <div className=\""+component_name+"\">\n\n"+
      "		</div>;\n"+
      "	}\n"+
      "}";
      fs.writeFile(comp_dir + "/component.jsx", js_content, function(err) {
        if (err) {return console.log(err);}
        console.log("Created "+component_name+".jsx...");
      });
      let all_js_content = fs.readFileSync(all_js, "utf8");
      let updated_js_content_1 = all_js_content.replace("\/******PlaceLocationHere******\/", "import "+component_name+" from \'..\/..\/components\/"+component_name+"\/component\'\;\n\/******PlaceLocationHere******\/");
      let updated_js_content_2 = updated_js_content_1.replace("\/******PlaceNameHere******\/", "  \,"+component_name+"\n\/******PlaceNameHere******\/");
      fs.writeFile(all_js, updated_js_content_2, function(err) {
        if (err) {return console.log(err);}
        console.log("Added to index.js...");
      });
    }

    done();
  });
};