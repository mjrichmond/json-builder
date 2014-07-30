function Builder(form) {
	this.form = form;
	this.json = null;
}

Builder.prototype.init = function(json) {	
	this.json = json;
	this.html = this.buildForm(json);
	this.resetForm();
	
	var form = this.form;
	form.on("click", ".append", function(e) {
		e.preventDefault();
		var prev = $(this).prev(".array");
		if (!prev) {
			return;
		}
		prev.clone()
			.insertAfter(prev)
			.find("input")
			.val("")
			.end()
			.find(".array:gt(0)")
			.remove();
		form.trigger("change");
	}).on("input", "input, textarea", function() {
		form.trigger("change");
	}).on("change", function() {
		console.log("CHANGE");
	});
};

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
			html += this.buildForm(props[i], name + i);
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

Builder.prototype.setFormValues = function(json, scope, name) {
	scope = scope || this.form;
	name = name || "";
	if (name == "") {
		this.resetForm();
	}
	
	var type = $.type(json);
	switch (type) {
	case "array":
		var array = scope.find("[data-name='" + name + "']");
		for (var i in json) {
			if (i != 0) { 
				array = array
					.clone()
					.insertAfter(array)
					.find(".array:gt(0)")
					.remove()
					.end();
			}
			this.setFormValues(json[i], array, name);
		}
		break;
	
	case "object":
		if (name) {
			name += ".";
		}
		for (var i in json) {
			this.setFormValues(json[i], scope, name + i);
		}
		break;
	
	case "string":
		var input = scope.find("[name='" + name + "']");
		input.val(json);
		break;
	}
};

Builder.prototype.getFormValues = function(json, name) {
	json = json || this.json;
	name = name || "";
};

Builder.prototype.resetForm = function() {
	this.form.html(this.html);
};

