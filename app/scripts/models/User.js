/*global happnCrossplatform, Backbone*/

happnCrossplatform.Models = happnCrossplatform.Models || {};

(function () {
    'use strict';

    happnCrossplatform.Models.UserModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
            name : "",
            type : ""
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        set: function(){
            Backbone.Model.set.call()
        }
    });


    var ben = new happnCrossplatform.Models.UserModel({
        name : "ben",
        type : "user"
    })

    //definition collections/baseCollection
    happnCrossplatform.Collections.Menues = Backbone.Collection.extend({
        model : happnCrossplatform.Models.UserModel
    });

    var collection1 = new baseCollection();

    collection1.push(ben);

    collection1.forEach(function( model ){
        if(model.get("type") === "user"){

        }
    });

    //def views/rootView.js
    var rootView = Backbone.view.extend({
        model : null,
        meals : null,
        currentDate : "1w2112",

        initialize : function( ){
            this.meals = new happnCrossplatform.Collection.Menues();
            this.fetch();
            this.render();
        },
        fetch : function(){
            $.getJSON('app.happn.de/' + date, function(data){
                data.forEach(function( mealData ){
                    var model = new Meal(mealData);
                    this.meals.push(model);
                })

                this.render();
            }, this);
        },

        render : function(){
            var currentMeals = this.meals.findWhere({
                date : this.currentDate
            });

            var template = _.template($('#templates-meals').html());

            var STRINGefjlkj3rg = template({
                meals : currentMeals 
            })
        }
    });

    $(function(){
        new rootView();
    });




})();
