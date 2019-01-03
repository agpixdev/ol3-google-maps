import Listener from './Listener';

class PropertyListener extends Listener {
  /**
   * Listener for OL object properties. Has utilities for listening on the property value.
   * @param {module:ol/Object~BaseObject} target Object with a property
   * @param {?module:ol/Object~BaseObject} oldTarget The previous object with a property
   * @param {string} key Property key
   * @param {function} listen Takes the current and previous property value as arguments.
   * Called on initialization and when the property value changes.
   * On initialization, the previous property value will be taken from the old target, if any.
   * Can return an AbstractListener or an array of AbstractListeners which will be unlistened when the property value changes.
   */
  constructor(target, oldTarget, key, listen) {
    super(target.on('change:' + key, e => {
      if (this.innerListener) {
        this.innerListener.unlisten();
      }
      this.innerListener = listen(e.target.get(e.key), e.oldValue);
    }));

    this.innerListener = listen(target.get(key), oldTarget && oldTarget.get(key));
  }

  /**
   * @inheritdoc
   */
  unlisten() {
    if (this.innerListener) {
      if (Array.isArray(this.innerListener)) {
        this.innerListener.forEach(listener => listener.unlisten());
      } else {
        this.innerListener.unlisten();
      }
    }
    super.unlisten();
  }
}

export default PropertyListener;
