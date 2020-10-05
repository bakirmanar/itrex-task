class SchoolGPAController {
    grades = [];
    selectedGrade;
    newStudent = {};

    // StudentsGrid specific fields (which are potentially can be moved to separate config object)
    MAX_STUDENTS_PER_PAGE = 30;
    studentsGridPage = 0;
    studentsGridApi;
    studentsGridOptions = {
        enableColumnMenus: false,
        enableSorting: false,
        infiniteScrollRowsFromEnd: 10,
        infiniteScrollUp: true,
        infiniteScrollDown: true,
        rowHeight: 40,
        columnDefs: [
            { name: 'name' },
            { name: 'gpa' },
            {
                name: 'delete',
                displayName: '',
                cellTemplate: '<button class="btn btn-outline-secondary btn-sm float-right mt-1 mr-2" '
                    + 'ng-click="grid.appScope.$ctrl.deleteStudent(row.entity.id)" type="button">X</button>'
            }
        ],
        data: [],
        onRegisterApi: (gridApi) => {
            this.studentsGridApi = gridApi;
            gridApi.infiniteScroll.on.needLoadMoreData(null, this.fetchStudents);
        }
    }

    static get $inject() { return ['$timeout', 'GradeService', 'StudentService', 'SchoolGPAService']; }
    constructor ($timeout, GradeService, StudentService, SchoolGPAService) {
        this.$timeout = $timeout;
        this.GradeService = GradeService;
        this.StudentService = StudentService;
        this.SchoolGPAService = SchoolGPAService;
    }

    $onInit = () => {
        this.GradeService.list().then((grades) => {
            this.grades = grades;
            this.selectGrade(this.grades[0]);
        });
    }

    selectGrade = (grade) => {
        this.selectedGrade = grade;
        this.resetNewStudent();
        this.studentsGridPage = 0;
        this.studentsGridOptions.data = [];
        this.fetchStudents().then(() => {
            // $timeout is needed to wait until digest cycle is completed according to example in ui-grid doc
            // http://ui-grid.info/docs/#!/tutorial/Tutorial:%20212%20Infinite%20scroll
            this.$timeout(() => this.studentsGridApi.infiniteScroll.resetScroll(false, true));
        });
    }

    addGrade = () => {
        const newGrade = {};
        this.GradeService.create(newGrade).then((createdId) => {
            newGrade.id = createdId;
            this.grades.push(newGrade);
            this.selectGrade(newGrade);
        });
    }

    deleteGrade = (gradeId) =>
        this.GradeService.delete(gradeId).then(() => {
            const index = this.grades.findIndex((grade) => grade.id === gradeId);
            if (index !== -1) {
                this.grades.splice(index, 1);
                this.selectedGrade.id === gradeId && this.selectGrade(this.grades[0]);
            }
        });

    fetchStudents = () =>
        this.StudentService.list(this.selectedGrade.id, this.MAX_STUDENTS_PER_PAGE, this.studentsGridOptions.data.length)
            .then((students) => {
                this.studentsGridPage++;
                this.studentsGridOptions.data = this.studentsGridOptions.data.concat(students);
                // $timeout is needed to wait until digest cycle is completed according to example in ui-grid doc
                // http://ui-grid.info/docs/#!/tutorial/Tutorial:%20212%20Infinite%20scroll
                this.$timeout(() => this.studentsGridApi.infiniteScroll.dataLoaded());
            });

    addStudent = () => {
        if (this.selectedGrade && this.newStudent.name && this.newStudent.gpa >= 0 && this.newStudent.gpa <= 10) {
            this.selectedGrade && this.StudentService.create(this.selectedGrade.id, this.newStudent).then((createdId) => {
                this.newStudent.id = createdId;
                // In case of adding new record to the end of table we should load the very last part of students (to show
                // just created record), that means scroll to very bottom. I think it can cause bugs/UX issues with infinite
                // scroll. So I decided to add new student to the start of the grid
                this.studentsGridOptions.data.unshift(this.newStudent);
                // $timeout is needed to wait until digest cycle is completed according to example in ui-grid doc
                // http://ui-grid.info/docs/#!/tutorial/Tutorial:%20212%20Infinite%20scroll
                this.$timeout(() => {
                    this.studentsGridApi.core.scrollTo(this.newStudent);
                    this.resetNewStudent();
                });
            });
        }
    }

    deleteStudent = (studentId) =>
        this.StudentService.delete(studentId).then(() => {
            const index = this.studentsGridOptions.data.findIndex((student) => student.id === studentId);
            if (index !== -1) {
                this.studentsGridOptions.data.splice(index, 1);
            }
        });

    resetNewStudent = () => {
        this.newStudent = {};
    }
}

const SchoolDPAComponent = {
    selector: 'schoolGpa',
    templateUrl: 'app/pages/schoolGPA/school-gpa.html',
    controller: SchoolGPAController
};

angular
    .module('schoolGPA')
    .component(SchoolDPAComponent.selector, SchoolDPAComponent);