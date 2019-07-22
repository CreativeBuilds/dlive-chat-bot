import * as React from 'react';
import { useContext, Component, useState, useEffect } from 'react';
import { theme, ThemeContext } from '../../helpers';
import {
  MdSend,
  MdPerson,
  MdMood,
  MdFace,
  MdLocalMovies,
  MdEvent,
  MdFilterList
} from 'react-icons/md';

enum ToggleType {
  compact,
  stretched
}

const Toggle = ({
  header,
  type,
  isOn,
  isEnabled,
  onClick,
  onChange = null,
  stateTheme,
  style = {}
}) => {
  return (
    <div
      style={Object.assign(
        {},
        Object.assign(
          {},
          !isEnabled ? stateTheme.toggle.disabled : null,
          type == ToggleType.stretched
            ? stateTheme.toggle.stretched
            : stateTheme.toggle.compact
        ),
        Object.assign({},
        style,
        stateTheme.toggle)
      )}
    >
      <div
        style={Object.assign(
          {},
          type == ToggleType.stretched
            ? stateTheme.toggle.header.stretched
            : stateTheme.toggle.header.compact
        )}
      >
        {header}
      </div>
      <div
        style={Object.assign(
          {},
          Object.assign(
            {},
            Object.assign(
              {},
              !isEnabled ? stateTheme.toggle.disabled.toggleBody : null,
              stateTheme.base.background
            ),
            type == ToggleType.stretched
              ? stateTheme.toggle.toggleBody.stretched
              : stateTheme.toggle.toggleBody.compact
          ),
          stateTheme.toggle.toggleBody
        )}
        onClick={e => {
          // setIsOn(!ison);
          if (isEnabled) {
            onClick();
          }
        }}
      >
        <div
          style={Object.assign(
            {},
            {
              background: isOn
                ? theme.globals.accentBackground.backgroundColor
                : stateTheme.base.secondaryBackground.backgroundColor
            },
            Object.assign(
              {},
              isOn ? stateTheme.toggle.toggleBody.isOn : '',
              stateTheme.toggle.toggleBody.handle
            )
          )}
        />
      </div>
    </div>
  );
};

export { Toggle, ToggleType };
