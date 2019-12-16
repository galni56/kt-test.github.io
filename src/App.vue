<template>
    <div id="app">
        <navigation></navigation>
        <header class="header">
            <div class="header__search">
                <label for="search">
                    <input class="header__search-input"
                           id="search"
                           type="text"
                           v-model.trim="searchQuery"
                           @keyup.enter="search"
                           @blur="search"
                           placeholder="Find movie...">
                </label>
            </div>
        </header>

        <movie-popup v-if="moviePopupIsVisible" @close="closeMoviePopup" :id="moviePopupId"></movie-popup>

        <section class="main">
            <transition name="fade"
                        @after-leave="afterLeave">
                <router-view name="list-router-view"
                             :type="'page'"
                             :mode="'collection'"
                             :key="$route.params.category">
                </router-view>
                <router-view name="search-router-view"
                             :type="'page'"
                             :mode="'search'"
                             :key="$route.params.query">
                </router-view>
                <router-view name="page-router-view"></router-view>
            </transition>
        </section>
    </div>
</template>

<script>
    import axios from 'axios'
    import storage from './storage.js'
    import Navigation from './components/Navigation.vue'
    import MoviePopup from './components/MoviePopup.vue'

    export default {
        name: 'app',
        components: {Navigation, MoviePopup},
        data() {
            return {
                moviePopupIsVisible: false,
                moviePopupHistoryVisible: false,
                moviePopupId: 0,
                searchQuery: ''
            }
        },
        computed: {
            queryForRouter() {
                return encodeURI(this.searchQuery.replace(/ /g, "+"));
            }
        },
        methods: {
            openMoviePopup(id, newMoviePopup) {
                if (newMoviePopup) {
                    storage.backTitle = document.title;
                }
                storage.createMoviePopup = newMoviePopup;
                this.moviePopupIsVisible = true;
                this.moviePopupId = id;
                document.querySelector('body').classList.add('hidden');
            },
            closeMoviePopup() {
                storage.createMoviePopup = false;
                this.moviePopupIsVisible = false;
                document.querySelector('body').classList.remove('hidden');
                window.history.back();
            },
            // Search Methods
            search() {
                if (!this.searchQuery.length) return;
                this.$router.push({name: 'search', params: {query: this.queryForRouter}});
            },
            setSearchQuery(clear) {
                if (clear) {
                    this.searchQuery = '';
                } else {
                    let query = decodeURIComponent(this.$route.params.query);
                    this.searchQuery = query ? query.replace(/\+/g, " ") : '';
                }
            },
            // Router After Leave
            afterLeave() {
                document.querySelector('body').scrollTop = 0;
            },
            // Detect if touch device
            isTouchDevice() {
                return 'ontouchstart' in document.documentElement;
            }
        },
        created() {
            eventHub.$on('openMoviePopup', this.openMoviePopup);
            eventHub.$on('setSearchQuery', this.setSearchQuery);
            if (this.isTouchDevice()) {
                document.querySelector('body').classList.add('touch');
            }
        }
    }
</script>

<style lang="scss">
    @import "./src/scss/variables";
    @import "./src/scss/media-queries";

    * {
        box-sizing: border-box;
    }

    html, body {
        height: 100%;
    }

    body {
        font-family: 'Arvo', sans-serif;
        line-height: 1.6;
        background: $c-light;
        color: $c-dark;

        &.hidden {
            overflow: hidden;
        }
    }

    input, textarea, button {
        font-family: 'Arvo', sans-serif;
    }

    figure {
        padding: 0;
        margin: 0;
    }

    img {
        display: block;
        max-width: 100%;
        height: auto;
    }

    @keyframes load {
        100% {
            transform: rotate(360deg);
        }
    }

    .wrapper {
        position: relative;
    }

    .header {
        position: fixed;
        background: $c-white;
        z-index: 15;
        width: 100%;
        display: flex;
        @include tablet-min {
            height: 50px;
            margin-left: 95px;
            border-top: 0;
            border-bottom: 0;
            top: 0;
        }

        &__search {
            display: flex;
            position: relative;
            z-index: 5;
            width: calc(100% - 40px);
            position: fixed;
            top: 0;
            right: 55px;
            @include tablet-min {
                position: relative;
                right: 0;
            }

            &-input {
                display: block;
                width: 100%;
                padding: 15px 20px 15px 25px;
                outline: none;
                border: 0;
                color: $c-dark;
                font-weight: 300;
                font-size: 16px;
            }
        }
    }

    .main {
        position: relative;
        padding: 50px 0 0;
        background-color: blueviolet;
        @include tablet-min {
            width: calc(100% - 95px);
            padding: 50px 0 0;
            margin-left: 95px;
            position: relative;
        }
    }

    .button {
        display: inline-block;
        border: 1px solid $c-dark;
        text-transform: uppercase;
        background: $c-dark;
        font-weight: 300;
        font-size: 11px;
        line-height: 2;
        letter-spacing: 0.5px;
        padding: 5px 20px 4px 20px;
        cursor: pointer;
        color: $c-green;
        outline: none;
        transition: background 0.5s ease, color 0.5s ease;
        @include tablet-min {
            font-size: 12px;
            padding: 6px 20px 5px 20px;
        }

        body:not(.touch) &:hover {
            color: $c-white;
        }
    }


    // view transition
    .fade-enter-active, .fade-leave-active {
        transition-property: opacity;
        transition-duration: 0.25s;
    }

    .fade-enter-active {
        transition-delay: 0.25s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
