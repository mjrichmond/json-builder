function Builder() {
	// ..
}

Builder.prototype.buildForm = function(json, name, html) {
	if (!json.type) {
		return;
	}

	name = name || "";
	html = html || "";

	switch (json.type) {
	case "array":
		var items = json.items;
		html = this.renderTemplate(
			"array", {
				name: name,
				html: this.buildForm(items, name)
			}
		);
		break;
		
	case "object":
		if (name) {
			name += ".";
		}
		var props = json.properties;
		for (var i in props) {
			html += this.buildForm(props[i], (name || "") + i);
		}
		html = this.renderTemplate(
			"object", {
				name: name,
				html: html
			}
		);
		break;
	
	case "string":
		html = this.renderTemplate(
			"string", {
				name: name
			}
		);
		break;
	}

	return html;
};

Builder.prototype.getTemplate = function(name) {
	return $("#templates")
		.find("script[data-name='" + name+ "']")
		.html();
}

var templates = [];
Builder.prototype.renderTemplate = function(name, data) {
	if (!templates[name]) {
		templates[name] = Handlebars.compile(this.getTemplate(name)); 
	}
	return templates[name](data);
};
