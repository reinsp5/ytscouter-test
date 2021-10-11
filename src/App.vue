<template>
  <!-- Navbar start -->
  <nav class="uk-navbar uk-navbar-container uk-margin">
    <div class="uk-navbar-left">
      <a
        class="uk-navbar-toggle"
        uk-navbar-toggle-icon
        href="#"
        uk-toggle="target: #offcanvas-nav-primary"
      ></a>
    </div>
  </nav>

  <div id="offcanvas-nav-primary" uk-offcanvas="mode: push; overlay: true">
    <div class="uk-offcanvas-bar uk-flex uk-flex-column">
      <ul class="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
        <li class="uk-active">
          <router-link :to="{ name: 'Home' }"
            ><span class="uk-margin-small-right" uk-icon="icon: home"></span>
            ホーム</router-link
          >
        </li>
        <li class="uk-parent">
          <router-link :to="{ name: 'About' }"
            ><span class="uk-margin-small-right" uk-icon="icon: info"></span>
            About</router-link
          >
        </li>
        <li class="uk-parent">
          <router-link :to="{ name: 'Settings' }"
            ><span class="uk-margin-small-right" uk-icon="icon: cog"></span>
            Setting</router-link
          >
        </li>
      </ul>
    </div>
  </div>
  <!-- Navbar end   -->

  <router-view />

  <a
    class="uk-position-bottom-left uk-margin-small"
    href="#"
    uk-totop
    uk-scroll
  ></a>
</template>

<style>
@font-face {
  font-family: "Noto-Sans";
  src: url("./assets/NotoSansJP-Regular.otf") format("otf");
}

* {
  font-family: "Noto-Sans", sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
