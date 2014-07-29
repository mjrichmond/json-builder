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
		html = Handlebars.templates["array"]({
				name: name,
				html: this.buildForm(items, name)
		});
		break;
		
	case "object":
		if (name) {
			name += ".";
		}
		var props = json.properties;
		for (var i in props) {
			html += this.buildForm(props[i], (name || "") + i);
		}
		html = Handlebars.templates["object"]({
			name: name,
			html: html
		});
		break;
	
	case "string":
		html = Handlebars.templates["string"]({
			name: name,
			title: name.split(".").pop()
		});
		break;
	}

	return html;
};
