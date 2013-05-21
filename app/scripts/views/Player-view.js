/**
 * Reproductor de música capaz de reproducir una canción
 * (dado su modelo)
 */
html5player.Views.PlayerView = Backbone.View.extend({

    className: 'player',
    template: new EJS({ url: 'scripts/templates/Player.ejs' }),

    events: {
        'click .controls > .buttons > .icon-play':          'modelPlay',
        'click .controls > .buttons > .icon-pause':         'modelPause',
        'click .controls > .buttons > .icon-fast-backward': 'modelBackward',
        'click .controls > .progressbar':                   'modelChangeTime',
        'click .controls > .volume':                        'toggleVolume'
    },

    /**
     * Constructor de la clase
     * @return {this} Se devuelve a sí mismo
     */
    initialize: function () {
        return this;
    },

    /**
     * Cambia el modelo (canción) del reproductor
     * Hace un renderizado completo de la vista para
     * que todos los elementos encajen
     * @param {SongModel} model Nueva canción que se quiere reproducir
     */
    setSong: function (model) {
        this.model = model;
        this.render();

        this.model
            .on('song:play', this.eventPlay, this)
            .on('song:pause song:end', this.eventPause, this)
            .on('change:elapsedTime change:totalTime', this.renderTime, this)
            .on('change:volume', this.renderVolume, this);

        return this;
    },

    /**
     * Crea la interfaz completa del reproductor
     * @return {this} Se devuelve a sí mismo
     */
    render: function () {
        var json = this.model.toJSON();

        // Ajuste de tiempo
        json.elapsedPercent = json.elapsedTime * 100 / json.totalTime;
        json.elapsedTime = html5player.Tools.convertTime(json.elapsedTime);
        json.totalTime = html5player.Tools.convertTime(json.totalTime);
        this.$el.html(this.template.render(json));

        // Guarda los elementos que se vayan a usar más tarde
        this.$elapsedTime = this.$el.find('>.time>.elapsedTime');
        this.$progressbar = this.$el.find('>.controls>.progressbar');
        this.$elapsedPercent = this.$el.find('>.controls>.progressbar>.elapsed');
        this.$volume = this.$el.find('>.controls>.volume');
        this.$totalTime = this.$el.find('>.time>.totalTime');
        this.$playPause = this.$el.find('>.controls>.buttons>.playPause');
        this.$albumCover = this.$el.find('>.album>img');

        // Color de fondo
        var me = this;
        this.$albumCover.on('load', function () {
            var color = html5player.Tools.getAverageRGB(me.$albumCover[0]);

            color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            me.$el.css('background-color', color);
        });
    },

    /**
     * Comprueba el tiempo de reproducción y actualiza la interfaz
     * para que lo muestre correctamente
     * @return {this} Se devuelve a sí mismo
     */
    renderTime: function () {
        var elapsedTime = html5player.Tools.convertTime(this.model.get('elapsedTime')),
            totalTime = html5player.Tools.convertTime(this.model.get('totalTime')),
            elapsedPercent = this.model.get('elapsedTime') * 100 / this.model.get('totalTime');

        this.$elapsedTime.html(elapsedTime);
        this.$totalTime.html(totalTime);
        this.$elapsedPercent.css('width', elapsedPercent + '%');
        return this;
    },

    /**
     * Actualiza el icono del volumen
     */
    renderVolume: function () {
        this.$volume
            .toggleClass('icon-volume-up')
            .toggleClass('icon-volume-off');
    },

    /**
     * Envía una orden para que el modelo asociado empiece a reproducirse
     * @return {this} Se devuelve a sí mismo
     */
    modelPlay: function () {
        this.model.play();
        return this;
    },

    /**
     * Reacciona ante el evento de reproducción del modelo.
     * Muestra el botón de pausa cuando se empiece a reproducir
     * @return {this} Se devuelve a sí mismo
     */
    eventPlay: function () {
        this.$playPause
            .addClass('icon-pause')
            .removeClass('icon-play');
        return this;
    },

    /**
     * Envía una orden de pausa al modelo
     * @return {this} Se devuelve a sí mismo
     */
    modelPause: function () {
        this.model.togglePause();
        return this;
    },

    /**
     * Reacciona ante el evento pausa del modelo
     * @return {this} Se devuelve a sí mismo
     */
    eventPause: function () {
        this.$playPause
            .addClass('icon-play')
            .removeClass('icon-pause');
        return this;
    },

    /**
     * Reinicia la reproducción de la canción
     * @return {this} Se devuelve a sí mismo
     */
    modelBackward: function () {
        this.model.setTime(0);
        return this;
    },

    /**
     * Cambia el instante de reproducción a otro
     * seleccionado en la barra de progreso
     */
    modelChangeTime: function (event) {
        this.model.setTime(event.offsetX * 100 / this.$progressbar.width())
        return this;
    },

    /**
     * Cambia el volumen a activo/inactivo
     */
    toggleVolume: function () {
        if (this.model.get('volume') <= 0) {
            this.model.setVolume(100);
        } else {
            this.model.setVolume(0);
        }
    }
});
