/**
 * auth: weilan
 * github: https://github.com/hql7
 * description: 一个数组操作函数库
 */

// 从树形数据中递归筛选目标值
function valInDeep(arr = [], val, id, childs) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[id] === val ? item : valInDeep(item[childs] || [], val, id, childs)
    );
  }, []);
}

// 将树形数据向下递归为一维数组
function flattenDeep(arr = [], childs='children') {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item,
      item[childs] ? flattenDeep(item[childs], childs) : []
    );
  }, []);
}

// 将树形数据向上将此支线递归为一维数组
function flattenDeepParents(arr, parent) {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item[parent] || [],
      item[parent] ? flattenDeepParents([item[parent]], parent) : []
    );
  }, []);
}

// 根据条件递归祖先元素
function regDeepParents(row, parent, reg) {
  if (row[parent]) {
    reg && reg(row[parent]);
    regDeepParents(row[parent], parent, reg);
  }
}


let defaultConfig = {
    id: 'id',
    parentId: 'parentId',
    dataField: 'data',
    childrenField: 'children',
    throwIfOrphans: false,
};
/**
 * Unflattens an array to a tree with runtime O(n)
 */
function arrayToTree(items, config) {
    let _a, _b, _c;
    if (config === void 0) { config = {}; }
    let _d;
    let conf = Object.assign(Object.assign({}, defaultConfig), config);
  // the resulting unflattened tree
    let rootItems = [];
    // stores all already processed items with their ids as key so we can easily look them up
    let lookup = {};
    // stores all item ids that have not been added to the resulting unflattened tree yet
    // this is an opt-in property, since it has a slight runtime overhead
    let orphanIds = config.throwIfOrphans ? new Set() : null;
    // idea of this loop:
    // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
    // in the lookup object and fill it with the data of the parent later
    // if an item has no parentId, add it as a root element to rootItems
    for (let _i = 0, items_1 = items; _i < items_1.length; _i++) {
        let item = items_1[_i];
        let itemId = item[conf.id];
        let parentId = item[conf.parentId];
        // look whether item already exists in the lookup table
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // item is not yet there, so add a preliminary item (its data will be added later)
            lookup[itemId] = (_a = {}, _a[conf.childrenField] = [], _a);
        }
        // if we track orphans, delete this item from the orphan set if it is in it
        if (orphanIds) {
            orphanIds.delete(itemId);
        }
        // add the current item's data to the item in the lookup table
        if (conf.dataField) {
            lookup[itemId][conf.dataField] = item;
        }
        else {
            lookup[itemId] = Object.assign(Object.assign({}, item), (_b = {}, _b[conf.childrenField] = lookup[itemId][conf.childrenField], _b));
        }
        let TreeItem = lookup[itemId];
        if (parentId === null || parentId === undefined || parentId === '') {
            // is a root item
            rootItems.push(TreeItem);
        }
        else {
            // has a parent
            // look whether the parent already exists in the lookup table
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // parent is not yet there, so add a preliminary parent (its data will be added later)
                lookup[parentId] = (_c = {}, _c[conf.childrenField] = [], _c);
                // if we track orphans, add the generated parent to the orphan list
                if (orphanIds) {
                    orphanIds.add(parentId);
                }
            }
            // add the current item to the parent
            lookup[parentId][conf.childrenField].push(TreeItem);
        }
    }
    if ((_d = orphanIds) === null || _d === void 0 ? void 0 : _d.size) {
        throw new Error("The items array contains orphans that point to the following parentIds: " +
            ("[" + Array.from(orphanIds) + "]. These parentIds do not exist in the items array. Hint: prevent orphans to result ") +
            "in an error by passing the following option: { throwIfOrphans: false }");
    }
    return rootItems;
}

export {
  valInDeep,
  flattenDeep,
  flattenDeepParents,
  regDeepParents,
  arrayToTree
};
