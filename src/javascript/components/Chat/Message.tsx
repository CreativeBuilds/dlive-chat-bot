import * as React from 'react';
import Styles from './Message.scss';
import { MdClose, MdAdd } from 'react-icons/md';
import { removeMessage } from '../../helpers/removeMessage';
import { AddStickerPopup } from './AddStickerPopup';

const Message = ({ styles, message, nth, stateTheme, ownerName, addPopup, config, closeCurrentPopup}) => {

  // Boolean Checks if Message is a Sticker or not
  const isSticker = () => {
    var content = message.content;
    if (content.search(/[:]/gi) > -1) {
      if (content.search(/emote/gi) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getStickerId = (id: String) => {
    var routes = id.replace(/[:]/gi, '').split('/');
    var imageRoute = routes[routes.length - 1];
    return imageRoute;
  };

  // if message is sticker then it is compiled into a url (returns a String)
  const getSticker = (str: String) => {
    var url = 'https://images.prd.dlivecdn.com/emote/' + getStickerId(str);
    console.log('Sticker URL:' + url);
    return url;
  };

  const canDelete = () => {
    return message.roomRole === 'Member' && message.role === 'None';
  };

  const addSticker = () => {
    addPopup(<AddStickerPopup stickerId={getStickerId(message.content)} stickerDLiveId={message.content} stickerUrl={getSticker(message.content)} stateTheme={stateTheme} styles={styles} Config={Object.assign({}, config)} text={<span>Stickers</span>} closeCurrentPopup={closeCurrentPopup}/>);
  }

  return (
    <div
      className={`${styles.message} ${
        message.content.toLowerCase().includes(ownerName)
          ? Styles.highlighted
          : ''
      }`}
      style={Object.assign(
        {},
        stateTheme.chat.message,
        nth % 2 ? stateTheme.chat.message.alternate : {}
      )}
    >
      <div className={styles.image_container}>
        <img src={message.sender.avatar} width={26} height={26} />
      </div>
      <div className={styles.message_content}>
        <span>
          {message.sender.dliveUsername}
          {': '}
        </span>
        {isSticker() ? (
          <div className={styles.sticker_container}>
            <div className={styles.emoteDeleteButton} onClick={addSticker}>
              <MdAdd />
            </div>
            <img className={styles.sticker} src={getSticker(message.content)} />
          </div>
        ) : (
          <div className={styles.message_content}>{message.content}</div>
        )}
      </div>
      {canDelete() ? (
        <div className={styles.message_remove}>
          <MdClose
            onClick={() => {
              removeMessage(message.id, message.streamerBlockchainUsername);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export { Message };
