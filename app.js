$().ready(function() {
    
    var socket = io.connect('http://localhost');
    
    var appText = Backbone.Model.extend({

        defaults: function() {
            return {
                title: "Type text here. It will be transparently saved.",
            };
        },

        initialize: function() {
            _.bindAll(this, "serverEvent", "callServer");
            socket.on('serverUpdate', this.serverEvent);
            this.bind('change', this.callServer);
        },

        serverEvent: function(data) { 
            if(!'title' in data)
                return;


            this.attributes['title'] = data['title'];
            this.trigger("rerender");
        },

        callServer: function() {
            socket.emit('clientUpdate', {title: this.get("title")});
        },

        urlRoot: "texts.txt",
    });

    var TextView = Backbone.View.extend({
        template: _.template($('#text-template').html()),

        events: {
            'keyup textarea': 'handleChange',
        },

        
        initialize: function() {
            _.bindAll(this, "handleChange", "modelChange");
            this.listenTo(this.model, 'change', this.modelChange);
            this.listenTo(this.model, 'rerender', this.modelChange);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        modelChange: function() {
            this.$el.children("textarea").val(this.model.get("title"));
        },

        handleChange: function() {
            this.model.set("title", this.$el.children("textarea").val());
        },
    });



    var AppView = Backbone.View.extend({
        el: $("#app"),
        initialize: function() {
            var tmodel = new appText();
            tmodel.fetch();
            var view = new TextView({model: tmodel });
            this.$el.append(view.render().el);
        },


        render: function() { return },
    });

    var App = new AppView();


});
