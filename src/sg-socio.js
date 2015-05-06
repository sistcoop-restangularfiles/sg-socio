'use strict';

(function(){

    var module = angular.module('sg-socio', ['restangular']);


    module.provider('sgSocio', function() {

        this.restUrl = 'http://localhost';

        this.$get = function() {
            var restUrl = this.restUrl;
            return {
                getRestUrl: function() {
                    return restUrl;
                }
            }
        };

        this.setRestUrl = function(restUrl) {
            this.restUrl = restUrl;
        };
    });


    module.factory('SocioRestangular', ['Restangular', 'sgSocio', function(Restangular, sgSocio) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(sgSocio.getRestUrl());
        });
    }]);

    module.factory('SGSocio', ['SocioRestangular',  function(SocioRestangular) {

        var url = 'socios';
        var urlCount = 'countryCodes/count';

        var modelMethos = {
            $new: function(id){
                return angular.extend({id: id}, modelMethos);
            },
            $build: function(){
                return angular.extend({independent: false}, modelMethos, {$save: function(){
                    return SocioRestangular.all(url).post(this);
                }});
            },
            $save: function() {
                return SocioRestangular.one(urlAlpha3Code, this.alpha3Code).customPUT(SocioRestangular.copy(this),'',{},{});
            },

            $find: function(id){
                return SocioRestangular.one(url, id).get();
            },
            $search: function(queryParams){
                return SocioRestangular.all(url).getList(queryParams);
            },
            $findByAlpha2code: function(alpha2Code){
                return SocioRestangular.one(urlAlpha2Code, alpha2Code).get();
            },
            $findByAlpha3code: function(alpha3Code){
                return SocioRestangular.one(urlAlpha3Code, alpha3Code).get();
            },
            $findByNumericCode: function(numericCode){
                return SocioRestangular.one(urlNumericCode, numericCode).get();
            },

            $count: function(){
                return SocioRestangular.one(urlCount).get();
            },

            $disable: function(){
                return SocioRestangular.all(url+'/'+this.id+'/disable').post();
            },
            $remove: function(id){
                return SocioRestangular.one(urlAlpha3Code, id).remove();
            }
        };

        SocioRestangular.extendModel(url, function(obj) {
            return angular.extend(obj, modelMethos);
        });
        SocioRestangular.extendModel(urlCount, function(obj) {
            return angular.extend(obj, modelMethos);
        });

        return modelMethos;

    }]);

})();