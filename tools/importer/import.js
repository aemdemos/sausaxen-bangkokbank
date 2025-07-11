/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import accordion11Parser from './parsers/accordion11.js';
import cards5Parser from './parsers/cards5.js';
import cards2Parser from './parsers/cards2.js';
import cards1Parser from './parsers/cards1.js';
import cards8Parser from './parsers/cards8.js';
import cards3Parser from './parsers/cards3.js';
import accordion6Parser from './parsers/accordion6.js';
import cards14Parser from './parsers/cards14.js';
import cards13Parser from './parsers/cards13.js';
import cards4Parser from './parsers/cards4.js';
import carousel20Parser from './parsers/carousel20.js';
import hero18Parser from './parsers/hero18.js';
import carousel12Parser from './parsers/carousel12.js';
import columns7Parser from './parsers/columns7.js';
import accordion17Parser from './parsers/accordion17.js';
import cards23Parser from './parsers/cards23.js';
import hero10Parser from './parsers/hero10.js';
import hero21Parser from './parsers/hero21.js';
import cards28Parser from './parsers/cards28.js';
import hero22Parser from './parsers/hero22.js';
import columns24Parser from './parsers/columns24.js';
import cards31Parser from './parsers/cards31.js';
import accordion33Parser from './parsers/accordion33.js';
import columns34Parser from './parsers/columns34.js';
import hero35Parser from './parsers/hero35.js';
import cards25Parser from './parsers/cards25.js';
import accordion36Parser from './parsers/accordion36.js';
import cards37Parser from './parsers/cards37.js';
import carousel27Parser from './parsers/carousel27.js';
import cards39Parser from './parsers/cards39.js';
import cards38Parser from './parsers/cards38.js';
import carousel40Parser from './parsers/carousel40.js';
import accordion41Parser from './parsers/accordion41.js';
import cards16Parser from './parsers/cards16.js';
import cards42Parser from './parsers/cards42.js';
import carousel32Parser from './parsers/carousel32.js';
import cards44Parser from './parsers/cards44.js';
import cards43Parser from './parsers/cards43.js';
import accordion47Parser from './parsers/accordion47.js';
import cards46Parser from './parsers/cards46.js';
import accordion48Parser from './parsers/accordion48.js';
import columns45Parser from './parsers/columns45.js';
import cards49Parser from './parsers/cards49.js';
import cards51Parser from './parsers/cards51.js';
import cards53Parser from './parsers/cards53.js';
import cards26Parser from './parsers/cards26.js';
import cards54Parser from './parsers/cards54.js';
import accordion50Parser from './parsers/accordion50.js';
import carousel30Parser from './parsers/carousel30.js';
import cards15Parser from './parsers/cards15.js';
import tabs29Parser from './parsers/tabs29.js';
import carousel52Parser from './parsers/carousel52.js';
import cards19Parser from './parsers/cards19.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  TableBuilder,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  accordion11: accordion11Parser,
  cards5: cards5Parser,
  cards2: cards2Parser,
  cards1: cards1Parser,
  cards8: cards8Parser,
  cards3: cards3Parser,
  accordion6: accordion6Parser,
  cards14: cards14Parser,
  cards13: cards13Parser,
  cards4: cards4Parser,
  carousel20: carousel20Parser,
  hero18: hero18Parser,
  carousel12: carousel12Parser,
  columns7: columns7Parser,
  accordion17: accordion17Parser,
  cards23: cards23Parser,
  hero10: hero10Parser,
  hero21: hero21Parser,
  cards28: cards28Parser,
  hero22: hero22Parser,
  columns24: columns24Parser,
  cards31: cards31Parser,
  accordion33: accordion33Parser,
  columns34: columns34Parser,
  hero35: hero35Parser,
  cards25: cards25Parser,
  accordion36: accordion36Parser,
  cards37: cards37Parser,
  carousel27: carousel27Parser,
  cards39: cards39Parser,
  cards38: cards38Parser,
  carousel40: carousel40Parser,
  accordion41: accordion41Parser,
  cards16: cards16Parser,
  cards42: cards42Parser,
  carousel32: carousel32Parser,
  cards44: cards44Parser,
  cards43: cards43Parser,
  accordion47: accordion47Parser,
  cards46: cards46Parser,
  accordion48: accordion48Parser,
  columns45: columns45Parser,
  cards49: cards49Parser,
  cards51: cards51Parser,
  cards53: cards53Parser,
  cards26: cards26Parser,
  cards54: cards54Parser,
  accordion50: accordion50Parser,
  carousel30: carousel30Parser,
  cards15: cards15Parser,
  tabs29: tabs29Parser,
  carousel52: carousel52Parser,
  cards19: cards19Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.entries(transformers).forEach(([, transformerFn]) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);
  // transform all elements using parsers
  [...blockElements, ...pageElements].forEach((item) => {
    const { element = main, ...pageBlock } = item;
    const isBlockElement = blockElements.includes(item);
    const parserName = WebImporter.Import.getParserName(pageBlock);
    const parserFn = parsers[parserName];
    if (!parserFn) return;
    try {
      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = main.querySelector(parserElement);
      }
      // before parse hook
      WebImporter.Import.transform(TransformHook.beforeParse, parserElement, { ...source });
      // parse the element
      if (isBlockElement) {
        WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
      }
      parserFn.call(this, parserElement, { ...source });
      if (isBlockElement) {
        WebImporter.DOMUtils.createTable = tableBuilder.restore();
      }
      // after parse hook
      WebImporter.Import.transform(TransformHook.afterParse, parserElement, { ...source });
    } catch (e) {
      console.warn(`Failed to parse block: ${parserName}`, e);
    }
  });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    const tableBuilder = TableBuilder(WebImporter.DOMUtils.createTable);

    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          WebImporter.DOMUtils.createTable = tableBuilder.build(parserName);
          parserFn.call(this, element, source);
          WebImporter.DOMUtils.createTable = tableBuilder.restore();
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    // sanitize the original URL
    /* eslint-disable no-param-reassign */
    source.params.originalURL = new URL(originalURL).href;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
