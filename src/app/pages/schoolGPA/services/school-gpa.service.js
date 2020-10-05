/**
 * This service needed only to emulate server side logic about Average GPA counting. Usually such service should have
 * 1-2 API calls, e.g. to get recalculated Average GPA. Or even recalculated Average GPA could be in response for each
 * CRUD student API call
 */
class SchoolGPAService {
    averageGPA = 0;

    recalculateAverageGPAByStudentsArray = (students) => {
        let gpaSum = 0;
        students.forEach((student) => {
            gpaSum = this.roundTo2DecimalPlaces(gpaSum + (student.gpa || 0));
        });
        this.averageGPA = gpaSum && students.length ? this.roundTo2DecimalPlaces(gpaSum / students.length) : 0;
    }

    onStudentAdded = (addedStudentGPA, newStudentsLength) => {
        const oldSum = this.roundTo2DecimalPlaces(this.averageGPA * (newStudentsLength - 1));
        this.averageGPA = this.roundTo2DecimalPlaces((oldSum + addedStudentGPA) / newStudentsLength);
    }

    onStudentRemoved = (removedStudentGPA, newStudentsLength) => {
        const oldSum = this.roundTo2DecimalPlaces(this.averageGPA * (newStudentsLength + 1));
        this.averageGPA = this.roundTo2DecimalPlaces((oldSum - removedStudentGPA) / newStudentsLength);
    }

    // Usually I would place this method in some util service
    roundTo2DecimalPlaces = (number) =>
        Math.round(number * 100) / 100;
}

angular
    .module('schoolGPA')
    .service('SchoolGPAService', SchoolGPAService);