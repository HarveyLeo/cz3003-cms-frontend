/**
 * Created by Haihui on 20/2/2016.
 */

"use strict";


describe('cmsControllers', function(){

    describe('loginCtrl', function(){

        var mainScope, childScope, $httpBackend;

        beforeEach(module('cmsApp'));

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend
                .when('POST', 'http://localhost/auth', {
                    username:'admin@gmail.com',
                    password:'admin'
                })
                .respond({
                    username: 'admin@gmail.com',
                    userId: 3,
                    userRole: 'manager'
                });

            mainScope = $rootScope.$new();
            $controller('appCtrl', {$scope: mainScope});
            childScope = mainScope.$new();
            $controller('loginCtrl', {$scope: childScope});
        }));

        it('should return a login http response', function() {
            childScope.login({
                username:'admin@gmail.com',
                password:'admin'
            });
            $httpBackend.flush();
            expect(mainScope.currentUser).toEqual({
                username: 'admin@gmail.com',
                userId: 3,
                userRole: 'manager'
            });
        });

    });


    describe('createNewIncidentCtrl', function(){

        var mainScope, childScope, $httpBackend;

        beforeEach(module('cmsApp'));

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend
                .when('POST', 'http://localhost/incidents', {
                    incidentType: 'Traffic Accident',
                    incidentName: 'Traffic Accident @Boon Lay',
                    time: '11:35 AM',
                    location: 'Boon Lay',
                    contactName: 'Ah Bing',
                    contactNumber: '93654562',
                    Description: ''
                })
                .respond({
                    incidentName: 'Traffic Accident @Boon Lay'
                });

            mainScope = $rootScope.$new();
            $controller('appCtrl', {$scope: mainScope});
            childScope = mainScope.$new();
            $controller('createNewIncidentCtrl', {$scope: childScope});
        }));

        it('should return a http response', function() {
            childScope.submit({
                incidentType: 'Traffic Accident',
                incidentName: 'Traffic Accident @Boon Lay',
                time: '11:35 AM',
                location: 'Boon Lay',
                contactName: 'Ah Bing',
                contactNumber: '93654562',
                Description: ''
            });
            $httpBackend.flush();
            expect(childScope.message).toEqual("Submitted");
        });

    });


});