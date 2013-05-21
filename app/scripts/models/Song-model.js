/**
 * Modelo referente a una canción
 * Puede reproducirse sin insertarse en el DOM
 */
html5player.Models.SongModel = Backbone.Model.extend({
    defaults: {
        title: '',
        artist: '',
        albumTitle: '',
        albumCover: '',

        elapsedTime: -1,
        totalTime: -1,
        volume: -1,

        songUrl: {},
        domElement: {}
    },
    
    /**
     * Crea el objeto de audio necesario para reproducir la canción
     * aunque no se inserta en ninguna parte
     */
    initialize: function (params) {
        this.set('domElement', document.createElement('audio'));

        // Prepara el evento de fin de reproducción
        var me = this,
            dom = me.get('domElement');
        dom.addEventListener('ended', function () {
            me.setTime(0);
            me.trigger('song:end');
        });
    },

    /**
     * Comienza la reproducción del audio
     * Si el archivo no ha sido cargado, lo carga
     * @return {this} Se devuelve a sí mismo
     */
    play: function () {
        var dom = this.get('domElement');

        // Si no esta pausado no hace nada
        if (dom.paused) {
            // Carga la cancion si no se ha hecho antes
            if (typeof dom.src === 'undefined' || dom.src === '') {
                dom.src = this.get('songUrl');
                dom.preload = 'auto';

                this.set('volume', dom.volume * 100);
            }
            dom.play();

            // Guarda el instante de reproducción
            var me = this;
            function getCurrentTime () {
                // Por si se acaba la reproducción
                if (!dom.paused) {
                    me.set({
                        'elapsedTime': dom.currentTime,
                        'elapsedTimeTimeout': setTimeout(getCurrentTime, 1000)
                    });

                    // Si el total esta listo, lo obtiene
                    if (dom.readyState && me.get('totalTime') === -1) {
                        me.set('totalTime', dom.duration);
                    }
                }
            }
            getCurrentTime();

            // Lanza el evento de reproduccion
            this.trigger('song:play');
        }

        return this;
    },

    /**
     * Pausa/inicia la reproducción
     * Funciona aunque no se haya usado play previamente
     * @param {boolean} forcePause Si se especifica siempre se hace una pausa
     * @return {this} Se devuelve a sí mismo
     */
    togglePause: function (forcePause) {
        if (this.get('domElement').paused && !forcePause) {
            this.play();
        } else {
            this.get('domElement').pause();
            // Evento de pausa
            this.trigger('song:pause');
        }

        return this;
    },

    /**
     * Detiene la reproducción
     * Cuidado, esto elimina el progreso actual
     * @return {this} Se devuelve a sí misma
     */
    stop: function () {
        this.togglePause(true);
        this.setTime(0);

        return this;
    },

    /**
     * Aumenta o disminuye el volumen del audio
     * @param {number} volume Nuevo volumen (entre 0 y 100)
     * @param {boolean} alter  Si se especifica, se alterará el volumen en el valor dado (aumentar, disminuir), en caso contrario se establece directamente el volumen pasado.
     * @return {this} Se devuelve a sí mismo
     */
    setVolume: function (volume, alter) {
        var dom = this.get('domElement'),
            volume = (!alter) ? volume / 100 : dom.volume + volume / 100;

        dom.volume = volume < 0 ? 0
                   : volume > 1 ? 1
                   : volume;

        this.set('volume', dom.volume * 100);

        // Evento de cambio de volumen
        this.trigger('song:changeVolume');

        return this;
    },

    /**
     * Cambia el instante en el que se reproduce la cancion
     * @param {number} time Nuevo tiempo
     * @param {boolean} alter Mismo funcionamiento que en setVolume
     */
    setTime: function (time, alter) {
        var totalTime = this.get('totalTime');

        if (totalTime !== -1) {
            // Transforma el tiempo de porcentaje a segundos
            time = totalTime * time / 100;

            var dom = this.get('domElement'),
                time = (!alter) ? time : dom.currentTime + time;

            dom.currentTime = time < 0 ? 0
                            : time > totalTime ? totalTime
                            : time;
            this.set('elapsedTime', time);

            // Evento de cambio de tiempo
            this.trigger('song:changeTime');
        }
        return this;
    },

    /**
     * Indica si el reproductor esta parado o no
     * @return {Boolean}
     */
    isPaused: function () {
        return this.get('domElement').paused;
    }
});
