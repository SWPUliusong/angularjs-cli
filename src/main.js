import "./assets/index.css"

import 'angular'
import '@uirouter/angularjs'

angular
    .module("app", [
        "ui.router",
    ])
    .config([
        "$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "./modules/home.html",
                })
                .state("profile", {
                    url: "/profile",
                    templateUrl: "./modules/profile.html",
                })

            $urlRouterProvider.otherwise("/home")
        }
    ])