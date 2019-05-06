import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';

const Window: any = window;
const { ipcRenderer, shell } = Window.require('electron');

const styles: any = require('./Banner.scss');

const Banner = ({ }) => {

    return (
        <div className={styles.banner}>
            <span>Test Banner</span>
        </div>);
};

export { Banner };