// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'reflect-metadata';
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto'; // mock indexedDb (service testing)


import {configure} from "mobx";
configure({ safeDescriptors: false });
