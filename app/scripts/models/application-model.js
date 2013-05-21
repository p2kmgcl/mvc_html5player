/**
 * Reproductor de música
 */
html5player.Models.ApplicationModel = Backbone.Model.extend({

    /**
     * Constructor de la aplicación
     * @param {SongModel} song Canción que se reproducirá
     * @return {this} Se devuelve a sí mismo
     */
    initialize: function (song) {
        this.player = new html5player.Views.PlayerView();
        this.song = song;

        this.player.setSong(song);
        return this;
    }
});
