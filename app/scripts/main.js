
window.html5player = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},

    init: function() {
        var song1 = new html5player.Models.SongModel({
                title: 'Superhero',
                artist: 'Benoit Stanek',
                albumTitle: '18',
                songUrl: "data/superhero.mp3",
                albumCover: "data/superhero.jpg"
            }),
            song2 = new html5player.Models.SongModel({
                title: 'Flammenco1',
                artist: 'Sunsearcher',
                albumTitle: 'Versatility',
                songUrl: "data/flammenco1.mp3",
                albumCover: "data/flammenco1.jpg"
            }),
            app1 = new html5player.Models.ApplicationModel(song1),
            appView1 = new html5player.Views.ApplicationView({
                model: app1
            }),
            app2 = new html5player.Models.ApplicationModel(song2),
            appView2 = new html5player.Views.ApplicationView({
                model: app2
            });
    }
};

$(document).ready(function(){
    html5player.init();
});
