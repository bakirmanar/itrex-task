/**
 * Normally should be a service for API calls. Since there is no server side this service:
 * 1) emulates API calls using $q (it also could be a regular promise)
 * 2) emulates server side work using local variable and some additional logic
 */
class GradeService {
    grades;

    static get $inject() { return ['$http', '$q']; }
    constructor ($http, $q) {
        this.$http = $http;
        this.$q = $q;

    }

    getCachedGrades = () => {
        const deferred = this.$q.defer();

        if (this.grades) {
            deferred.resolve(this.grades);
        } else {
            this.$http.get('app/pages/schoolGPA/stabs/grades.json').then((gradesResponse) => {
                this.grades = gradesResponse.data || [];
                deferred.resolve(this.grades);
            }, (error) => deferred.reject(error));
        }

        return deferred.promise;
    }

    create = (grade) => {
        const deferred = this.$q.defer();

        this.getCachedGrades().then(() => {
            const id = Date.now();
            // Creating copy of object to prevent changing of cache from outside
            this.grades.push({...grade, id});
            deferred.resolve(id);
        });

        return deferred.promise;
    }

    list = () => {
        const deferred = this.$q.defer();

        this.getCachedGrades().then((grades) => {
            // Creating copy of array by [].concat( ... ) to prevent changing of cache from outside
            // (actually should make a copy of each grade, but since this cache logic needed only for interview task I
            // decided to leave it as it)
            deferred.resolve([].concat(grades));
        });

        return deferred.promise;
    }

    update = (id, grade) => {
        const deferred = this.$q.defer();

        this.getCachedGrades().then(() => {
            const index = this.grades.findIndex((grade) => grade.id === id);
            if (index === -1) {
                deferred.reject('Not found');
            } else {
                // Creating copy of object to prevent changing of cache from outside
                this.grades[index] = {...grade, id};
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    delete = (id) => {
        const deferred = this.$q.defer();

        this.getCachedGrades().then(() => {
            const index = this.grades.findIndex((grade) => grade.id === id);
            if (index === -1) {
                deferred.reject('Not found');
            } else {
                this.grades.splice(index, 1);
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
}

angular
    .module('schoolGPA')
    .service('GradeService', GradeService);