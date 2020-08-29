import ACTION_TYPES from '../ACTION_TYPES';
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadCourseSuccess(courses) {
  return { type: ACTION_TYPES.LOAD_COURSES_SUCCESS, courses };
}

export function createCourseSuccess(course) {
  return { type: ACTION_TYPES.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
  return { type: ACTION_TYPES.UPDATE_COURSE_SUCCESS, course };
}

export function loadCourses() {
  return function(dispatch) {
    dispatch(beginApiCall());
    return courseApi
      .getCourses()
      .then(courses => {
        dispatch(loadCourseSuccess(courses));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function saveCourse(course) {
  //eslint-disable-next-line no-unused-vars
  return function(dispatch, getState) {
    dispatch(beginApiCall());
    return courseApi
      .saveCourse(course)
      .then(savedCourse => {
        course.id
          ? dispatch(updateCourseSuccess(savedCourse))
          : dispatch(createCourseSuccess(savedCourse));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}