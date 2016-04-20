export const IGNORE_CLASS = 'ignore-onclickoutside';

export const isNodeFound = function(current,componentNode,ignoreClass) {
	if(current === componentNode){
		return true;
	}
	if (current.correspondingElement) {
    return current.correspondingElement.classList.contains(ignoreClass);
  }
  return current.classList.contains(ignoreClass);
}

export const generateOutsideCheck = function(componentNode,eventHandler,ignoreClass,preventDefault,stopPropagation) {
  return function(evt) {
    if(preventDefault) {
      evt.preventDefault();
    }
    if(stopPropagation) {
      evt.stopPropagation();
    }
    let current = evt.target;
    let found = false;
    while(current.parentNode) {
      found = isNodeFound(current,componentNode,ignoreClass);
      if(found)return;
      current = current.parentNode;
    }
    if(current !== document) return;
    eventHandler(evt);
  }
}

export const registeredComponents = [];

export const handlers = [];
