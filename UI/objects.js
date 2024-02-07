import { fetchData } from './fetch.js';
//to calculate the amount of exercises and projects
async function calculateObjects() {
    try {
      const data = await fetchData();
      const filteredData = data.transaction.filter(item => !item.type.includes('up'));
  
      const projectElement = document.getElementById('project');
      const exerciseElement = document.getElementById('exercise');
      const typeCounts = {
        exercise: 0,
        project: 0,
      };
  
      filteredData.forEach(row => {
        const { object } = row;
        if (object) {
          typeCounts[object.type]++;
        }
      });
  
      exerciseElement.textContent = typeCounts.exercise.toString();
      projectElement.textContent = typeCounts.project.toString();
  
    } catch (error) {
      errorMessage.textContent = 'Error calculating the numbers of exercises and projects';
    }
  }
  
  document.addEventListener('DOMContentLoaded', calculateObjects);
  