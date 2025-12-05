import type { ScanTask } from "./types";

/**
 * Takes the raw list of scanned tasks and expands any "Range Requests"
 * into individual tasks for each item in the range.
 * * Example:
 * Input: One task for "post:0-5" on a <div id="container">
 * Output: 5 tasks for "post:0", "post:1"... each linked to a new child element.
 */
export function expandRangeTasks(tasks: ScanTask[]): ScanTask[] {
  return tasks.flatMap(task => {
    const { attributes, element } = task;

    // Check if this is a Range Task (has a count > 0)
    // E.g. syntax "post:0-10" parses to { index: 0, count: 10 }
    if (typeof attributes.count === 'number' && attributes.count > 0) {
      const start = attributes.index ?? 0;
      const count = attributes.count;
      const expanded: ScanTask[] = [];

      for (let i = 0; i < count; i++) {
        const currentIndex = start + i;
        const childTag = element.tagName === 'UL' || element.tagName === 'OL' ? 'li' : 'div';
        const placeholder = document.createElement(childTag);
        
        placeholder.setAttribute("data-foundy-generated", String(currentIndex));
        
        element.appendChild(placeholder);

        expanded.push({
          ...task,
          
          address: `${task.type}:index:${currentIndex}`,
          
          attributes: {
            ...attributes,
            index: currentIndex,
            count: undefined,
            name: undefined   
          },
          
          element: placeholder, 
          parent: element,     
          
          isInViewport: task.isInViewport,
          domDepth: task.domDepth! + 1      
        });
      }

      return expanded;
    }

    // If not a range, return the original task as-is
    return [task];
  });
}