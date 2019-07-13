import * as React from 'react';
import { useState } from 'react';

import { ToggleBox } from './ToggleBox';
import { Checkbox } from '../Generics/Checkbox';
import { Button, DestructiveButton, ActionButton, WidgetButton } from '../Generics/Button';
import { TextField, StepperField } from '../Generics/Input';

import { MdModeEdit, MdEdit, MdDelete } from 'react-icons/md';
import { theme } from '../../helpers';
import { firebaseCommands$, setRxCommands } from '../../helpers/rxCommands';
import { first } from 'rxjs/operators';

const Window: any = window;
const { ipcRenderer } = Window.require('electron');

const Popup = ({ command, styles, closeCurrentPopup, stateTheme }) => {
  const [name, setName] = useState<string>(command.name);
  const [reply, setReply] = useState<string>(command.reply);
  // const [uses, setUses] = useState<number>(command.uses);
  const [permissions, setPermissions] = useState(command.permissions);

  const saveToDB = () => {
    if (name.length === 0) return;
    firebaseCommands$.pipe(first()).subscribe(commands => {
      let newCommands = Object.assign({}, commands);
      console.log('GOT COMMANDS IN SAVETODB', commands, newCommands);
      if (command.name !== name) {
        delete newCommands[command.name];
      }
      newCommands[name] = Object.assign({}, command, { name, reply });
      setRxCommands(newCommands);
    });
    // ipcRenderer.send('editcommand', {
    //   oldName: command.name,
    //   name,
    // obj: {
    //   reply,
    //   name,
    //   uses: 0,
    //   permissions,
    //   enabled: command.enabled
    // }
    // });
  };

  return (
    <div className={styles.popup}>
      <h2>Edit Command</h2>
      <div style={{ width: '70%', minWidth: 'unset' }}>
        <TextField 
          text={name}
          placeholderText={"Name"} 
          header={"Name"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={stateTheme.base.secondaryBackground}
          onChange={e => {
            setName(e.target.value);
          }}/>
        <TextField 
          text={reply}
          placeholderText={"Reply"} 
          header={"Reply"}
          stateTheme={stateTheme} 
          width={'100%'}
          inputStyle={stateTheme.base.secondaryBackground}
          onChange={e => {
            setReply(e.target.value);
          }}/>
        </div>
      {/* <div className={styles.input_wrapper}>
        <div className={styles.input_name}>Uses</div>
        <textarea
          className={styles.input}
          onChange={e => {
            setUses(Number(e.target.value));
          }}
          value={uses}
        />
      </div> */}
      <Button 
        title={"Save"} 
        isSubmit={true} 
        stateTheme={stateTheme}  
        onClick={() => {
          // if (isNaN(Number(uses))) return;
          // setUses(Number(uses));
          saveToDB();
          closeCurrentPopup();
        }} />
    </div>
  );
};

const RemoveCommandPopup = ({
  command,
  styles,
  closeCurrentPopup,
  stateTheme,
  commands
}) => {
  let name = command.name;

  const saveToDB = () => {
    if (name.length === 0) return;
    let Commands = Object.assign({}, commands);
    delete Commands[name];
    setRxCommands(Commands);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.remove_text}>
        You're about to delete this command! Are you sure you want to do that?
      </div>
      <DestructiveButton 
        title={"Yes"} 
        isSubmit={true}
        stateTheme={stateTheme} 
        onClick={() => {
            saveToDB();
            closeCurrentPopup();
          }} />
    </div>
  );
};

const Command = ({
  styles,
  command,
  nth,
  stateTheme,
  addPopup,
  closeCurrentPopup,
  commands
}) => {
  const updateCommandPopup = command => {
    addPopup(
      <Popup
        command={command}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
      />
    );
  };

  const removeCommandPopup = command => {
    addPopup(
      <RemoveCommandPopup
        command={command}
        styles={styles}
        closeCurrentPopup={closeCurrentPopup}
        stateTheme={stateTheme}
        commands={commands}
      />
    );
  };

  return (
    <div
      className={styles.user}
      style={Object.assign(
        {},
        stateTheme.cell.normal,
        nth % 2 ? stateTheme.cell.alternate : {}
      )}
    >
      <div
        className={styles.toggle_wrappers}
        style={stateTheme.base.quinaryForeground}
      >
        <div className={styles.username}>
          {command.name}{' '}
          <WidgetButton 
            icon={<MdModeEdit />} 
            stateTheme={stateTheme} 
            onClick={() => {
              updateCommandPopup(command);
            }}/>
        </div>
        {/* <div className={styles.points}>{command.uses}</div> */}
        <div className={styles.spacer} />
        <div className={styles.modded}>
          {/*<ToggleBox
            styles={styles}
            command={command}
            stateTheme={stateTheme}
            ipcRenderer={ipcRenderer}
          />*/}
          <Checkbox isOn={command.enabled} 
          stateTheme={stateTheme} 
          onClick={(value) => { 
            firebaseCommands$.pipe(first()).subscribe(commands => {
              let newCommands = Object.assign({}, commands);
              Object.keys(newCommands).forEach(key => {
                if (key === command.name) {
                  newCommands[key] = Object.assign({}, newCommands[key], {
                    enabled: value
                  });
                }
              });
              setRxCommands(newCommands);
            });
           }} />
        </div>
        <div className={styles.modded}>
          <WidgetButton 
            icon={<MdDelete />} 
            stateTheme={stateTheme} 
            onClick={() => {
              removeCommandPopup(command);
            }}/>
        </div>
      </div>
    </div>
  );
};

export { Command };
