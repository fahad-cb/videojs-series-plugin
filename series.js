
'use strict';
var vjs = require('video.js');
var fs = require('fs');


var defaults = {},
    videoJsResolutionSwitcher,
    currentResolution = {},
    menuItemsHolder = {}; // stores menuItems

vjs.plugin('series', function(opt){
    var player = this;
    player.ready(function(){
        var b, controlBar = player.controlBar;
        b = controlBar.seriesMenu = controlBar.addChild('seriesMenuButton', opt||{});
    });

});
var events = ['touchstart', 'touchend', 'click'];
var prevent_click = function(event){
    event.stopPropagation();
};


var Menu        = vjs.getComponent('Menu');
var MenuButton  = vjs.getComponent('MenuButton');
var MenuItem  = vjs.getComponent('MenuItem');

//Episdoes Listings
var SeasonsMenuItem = vjs.extend( MenuItem, {
    className: 'vjs-series-video',
    constructor : function(player, options, settings, label){
        MenuItem.call(this, player, options);
        this.options = options;
        this.player = player;
        this.addClass(this.className+'-'+this.options.id);
        this.addClass(this.className);
        if (options.initialySelected){
            this.addClass('vjs-menuitem-selected');
        } 
        this.HandleClick = false;
        
        if (typeof options.HandleClick != 'undefined' && options.HandleClick == true){
            this.HandleClick = true;
        }
        this.el_.setAttribute('data-id',this.options.id);
        var innterHTML = '';
        if (typeof this.options.description != 'undefined'){
            this.el_.setAttribute('data-link',this.options.link);
            innterHTML = '<span>'+options.label+'</span>'+
            '<div class="Series_dtl show">'+
                '<div class="thumbinner">'+
                    '<span class="hover-icon">'+fs.readFileSync('./src/img/play_arrow.svg', 'utf8')+'</span>'+
                    '<img src="'+options.thumb+'">'+
                '</div>'+
                '<div class="body-1 des">'+options.description+'</div>'+
            '</div>';
            this.el().innerHTML = innterHTML;
        }else{
            innterHTML = '<span class="vjs-menu-item-label">'+options.label+'</span>'+
            fs.readFileSync('./src/img/next.svg', 'utf8');
            this.el().innerHTML = innterHTML;
        }
    },
    handleClick : function(){
        var siblings = this.el_.parentElement.childNodes;
        for(var i_ = 0; i_ < siblings.length; i_++){
            siblings[i_].classList.remove('vjs-menuitem-selected');
        }
        this.addClass('vjs-menuitem-selected');
        if (this.HandleClick == false){
          return;
        }
        var id = this.el_.getAttribute('data-id');
        var allMenus = document.getElementsByClassName('vjs-seasons-submenu');
        for (var i = 0; i < allMenus.length; i++){
            allMenus[i].classList.remove('vjs-submenu-selected');
        }
        var newMenu = document.getElementsByClassName('vjs-seasons-submenu-'+id);
        newMenu[0].classList.add('vjs-submenu-selected');

    },
});


//Episdoes Listings
var BackMenuItem = vjs.extend( MenuItem, {
    className: 'vjs-seasons-listing',
    constructor : function(player, options, settings, label){
        MenuItem.call(this, player, options);
        this.options = options;
        this.player = player;
        this.addClass(this.className+'-'+this.options.id);
        this.el_.setAttribute('data-id',this.options.id);
        var innterHTML = fs.readFileSync('./src/img/prvicon.svg', 'utf8')+
        '<span class="vjs-menu-item-label">'+options.label+'</span>';
        this.el().innerHTML = innterHTML;
    },
    handleClick : function(){
       
        var id = this.el_.getAttribute('data-id');
        var allMenus = document.getElementsByClassName('vjs-seasons-submenu');
        for (var i = 0; i < allMenus.length; i++){
            allMenus[i].classList.remove('vjs-submenu-selected');
        }
        allMenus[0].classList.add('vjs-submenu-selected');

    },
});

//Episode SubMenus
var SeasonsSubMenu = vjs.extend( Menu, {
    className: 'vjs-seasons-submenu',
    constructor : function(player, options, settings, label){
        Menu.call(this, player, options);
        this.addClass(this.className);
        this.addClass('vjs-episodes-submenu');
        this.addClass(this.className+'-'+options.label);
        this.options = options;
        this.episodes = options.episodes;   
        if (options.initialySelected){
            this.addClass('vjs-submenu-selected');
        }    
        this.title = options.label;
        this.createTitleItem();
        this.createItems();

    },
    
    createItems: function(){
        var items = this.episodes;
        for (var i=0; i < items.length; i++){
            var item_number = i+1;
            var options_ = {
                id: items[i].id,
                label: item_number+'. '+items[i].title,
                description: items[i].description,
                initialySelected: items[i].selected,
                thumb: items[i].thumb,
                link: items[i].link,
                HandleClick : false
            };

            var Item = new SeasonsMenuItem(this.player_, options_, this);
            this.addChild(Item);
        }
    },
    createTitleItem: function(){
        if (!this.title)
            return;
        //console.log('yes');
        var _this = this;
        var options_ = {
            id: this.title,
            label: 'Season '+this.title,
            initialySelected: false,
        };
        var title = new BackMenuItem(this.player_, options_);
        title.addClass('vjs-submenu-title');
        this.addChild(title);
        this.titleItem = title;
    },
    buildCSSClass: function(){
        return 'vjs-seasons-submenu '+Menu.prototype.buildCSSClass.call(this);
    }
});



//Seasons SubMenus list
var SeasonsSubMenuList = vjs.extend( Menu, {
    className: 'vjs-seasons-submenu',
    constructor : function(player, options, settings, label){
        Menu.call(this, player, options);
        this.options = options;
        this.seasonItems = options.seasonItems;   

        this.addClass(this.className);
        this.addClass(this.className+'-one');
        this.addClass('vjs-submenu-selected');  
        this.createItems();
    },
    createItems: function(){
        //creating seasons list for selection
        var selected = false;
        var items = this.seasonItems;
        for (var i=0; i < items.length; i++){
            var item_number = i+1;
            if (item_number == this.options.selectedSeason){
                selected = true;
            }else{
                selected = false;
            }
            var options_ = {
                id: item_number,
                label: 'Season '+item_number,
                initialySelected: selected,
                HandleClick : true
            };

            var Item = new SeasonsMenuItem(this.player_, options_, this);
            this.addChild(Item);
        }
    },
    buildCSSClass: function(){
        return 'vjs-seasons-submenu '+Menu.prototype.buildCSSClass.call(this);
    }
});

//Seasons SubMenus
var SeasonsMenu = vjs.extend( Menu, {
    className: 'vjs-seasons-menu',
    controlText_: 'Seasons',
    constructor : function(player, options, settings, label){
        Menu.call(this, player, options);
        this.addClass(this.className);
        this.children().forEach(this.removeChild.bind(this));
        this.options = options;
        this.seasons = options.seasons;
        this.createItems();
    },
    dispose: function(){
        Menu.prototype.dispose.call(this);
    },
    createEl: function(){
        var el = Menu.prototype.createEl.apply(this, arguments);
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-menu-content'
        }));
        el.setAttribute('role', 'presentation');
        return el;
    },
    show: function(visible){
        if (visible){
            this.addClass('vjs-lock-showing');
        }else{
            this.removeClass('vjs-lock-showing');
        }
        return;
    },
    createItems: function(){
        var seasons = this.seasons;
        var selected = false;

        //Menu for Season list
        var seasonsItemsOptions = {
            selectedSeason: this.seasons.selected,
            seasonItems : this.seasons
        };
        var menuSeason = new SeasonsSubMenuList(this.player_, seasonsItemsOptions, this);
        this.addChild(menuSeason);

        //This is season item list
        for (var i=0; i < seasons.length; i++){
            var season_number = i+1;
            if (season_number == this.seasons.selected){
                selected = true;
            }else{
                selected = false;
            }
            var options_ = {
                label: season_number,
                initialySelected: selected,
                episodes : seasons[i].episodes 
            };
            var menu = new SeasonsSubMenu(this.player_, options_, this);
            this.addChild(menu);
        }
    },
});

//Menu button for series seasons
vjs.registerComponent('SeriesMenuButton', vjs.extend( MenuButton, {
    controlText_: 'SeasonsButton',
    constructor: function(player, options, settings, label){
        MenuButton.call(this, player, options, settings);
        //console.log(this.options_);
        var menu = new SeasonsMenu(player, this.options_, this);
        player.addChild(menu);
        this.menu = menu;
        this.buttonPressed_ = false;
        this.el_.setAttribute('aria-expanded', 'false');
        this.player = player;
    },
    createEl: function(){
        var el = MenuButton.prototype.createEl.apply(this, arguments);
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-button-icon',
            innerHTML: fs.readFileSync('./src/img/series.svg', 'utf8'),
        }));
        return el;
    },
    buildCSSClass: function(){
        return MenuButton.prototype.buildCSSClass.call(this)+
            ' vjs-series-button';
    },
    handleClick: function(){
        //console.log(this.buttonPressed_);
        if (this.buttonPressed_){
            this.unpressButton();
            this.player.controlBar.getChild('progressControl').show();
        }else{
            this.pressButton();
            this.player.controlBar.getChild('progressControl').hide();
        }
    },
    updateState: function(){
        this.menu.show(this.buttonPressed_);
    },
    unpressButton: function(){
        this.buttonPressed_ = false;
        this.updateState();
        
    },
    pressButton: function(){
        this.buttonPressed_ = true;
        this.updateState();
    },


}));