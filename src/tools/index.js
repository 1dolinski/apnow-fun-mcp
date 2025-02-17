import { projectTools } from './projectTools.js';
import { docsTools } from './docsTools.js';

export function registerTools() {
  return new Map([
    ...projectTools,
    ...docsTools
  ]);
}
