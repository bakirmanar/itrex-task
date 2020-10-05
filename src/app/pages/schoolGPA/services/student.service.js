/**
 * Normally should be a service for API calls. Since there is no server side this service:
 * 1) emulates API calls using $q (it also could be a regular promise)
 * 2) emulates server side work using local variable and some additional logic
 */
class StudentService {
    students;

    static get $inject() { return ['$http', '$q', 'SchoolGPAService']; }
    constructor ($http, $q, SchoolGPAService) {
        this.$http = $http;
        this.$q = $q;
        this.SchoolGPAService = SchoolGPAService;
    }

    getCachedStudents = () => {
        const deferred = this.$q.defer();

        if (this.students) {
            deferred.resolve(this.students);
        } else {
            this.$http.get('app/pages/schoolGPA/stabs/students.json').then((studentsResponse) => {
                this.students = studentsResponse.data || [];
                this.SchoolGPAService.recalculateAverageGPAByStudentsArray(this.students);
                deferred.resolve(this.students);
            }, (error) => deferred.reject(error));
        }

        return deferred.promise;
    }

    create = (gradeId, student) => {
        const deferred = this.$q.defer();

        this.getCachedStudents().then(() => {
            const id = Date.now();
            this.students.unshift({...student, id, gradeId});
            this.SchoolGPAService.onStudentAdded(student.gpa, this.students.length);
            deferred.resolve(id);
        });

        return deferred.promise;
    }

    list = (gradeId, max, offset) => {
        const deferred = this.$q.defer();

        this.getCachedStudents().then((students) => {
            // Creating copy of array by [].concat( ... ) to prevent changing of cache from outside
            deferred.resolve([].concat(students.filter((student) => student.gradeId === gradeId).slice(offset, offset + max)));
        }, (error) => deferred.reject(error));

        return deferred.promise;
    }

    delete = (studentId) => {
        const deferred = this.$q.defer();

        this.getCachedStudents().then(() => {
            const index = this.students.findIndex((student) => student.id === studentId);
            if (index === -1) {
                deferred.reject('Not found');
            } else {
                const removedStudent = this.students[index];
                this.students.splice(index, 1);
                this.SchoolGPAService.onStudentRemoved(removedStudent.gpa, this.students.length);
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    deleteByGradeId = (gradeId) => {
        this.students = this.students.filter((student) => student.gradeId !== gradeId);
        this.SchoolGPAService.recalculateAverageGPAByStudentsArray(this.students);
    }
}

angular
    .module('schoolGPA')
    .service('StudentService', StudentService);