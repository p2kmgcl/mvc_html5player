/**
 * Vista del reproductor de música
 */
html5player.Views.ApplicationView = Backbone.View.extend({

    className: 'html5Player',

    /**
     * Constructor de la vista
     * @return {this} Se devuelve a sí mismo
     */
    initialize: function (params) {
        this.model = params.model;

        $('body').prepend(this.el);
        this.render();
    },

    /**
     * Forma el reproductor de la aplicación
     * @return {this} Se devuelve a sí mismo
     */
    render: function () {
        this.$el.html(this.model.player.el);

        return this;
    }

});
