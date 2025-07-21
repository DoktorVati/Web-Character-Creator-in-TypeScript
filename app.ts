// app.ts - TypeScript for a website

// Interface for a character
interface Character {
    id: string;
    firstName: string;
    lastName: string;
    age?: number;
    height?: number;
    weight?: number;
}

// Class to handle greetings on the webpage
class CharacterManager {
    private characters: Character[] = [];
    private currentCharacter: Character | null = null;
    private selectElement: HTMLSelectElement;
    private deleteButton: HTMLButtonElement;
    private clearButton: HTMLButtonElement;

    constructor() {
        this.selectElement = document.getElementById('character-select') as HTMLSelectElement;
        this.deleteButton = document.getElementById('delete-character') as HTMLButtonElement;
        this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;

        this.loadCharacters();
        this.setupEventListeners();
        this.renderCharacterList();
    }

    private loadCharacters(): void {
        const saved = localStorage.getItem('characters');
        this.characters = saved ? JSON.parse(saved) : [];
    }

    private saveCharacters(): void {
        localStorage.setItem('characters', JSON.stringify(this.characters));
    }

    private setupEventListeners(): void {
        document.getElementById('user-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.selectElement.addEventListener('change', () => this.handleCharacterSelect());
        this.deleteButton.addEventListener('click', () => this.deleteCurrentCharacter());
        this.clearButton.addEventListener('click', () => this.clearDisplay());
    }

    private handleFormSubmit(e: Event): void {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const characterData: Character = {
            id: this.currentCharacter?.id || Date.now().toString(),
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            age: formData.get('age') ? parseInt(formData.get('age') as string): undefined,
                height: formData.get('height') ? parseFloat(formData.get('height') as string): undefined,
                weight: formData.get('weight') ? parseFloat(formData.get('weight') as string): undefined,
            };
        this.saveCharacter(characterData);
        form.reset();
    }

    private saveCharacter(character: Character): void {
        const existingIndex = this.characters.findIndex(c => c.id === character.id);

        if(existingIndex >= 0) {
            this.characters[existingIndex] = character;
        } else {
            this.characters.push(character);
        }

        this.saveCharacters();
        this.renderCharacterList();
        this.selectCharacter(character.id);
    }

    private deleteCurrentCharacter(): void {
        if (!this.currentCharacter) return;

        if (confirm(`Delete ${this.currentCharacter.firstName} ${this.currentCharacter.lastName}?`)){
            this.characters = this.characters.filter(c => c.id !== this.currentCharacter?.id);
            this.saveCharacters();
            this.renderCharacterList();
            this.currentCharacter = null;
            this.updateDisplay();
        }
    }

    private handleCharacterSelect(): void {
        const selectedId = this.selectElement.value;
        if (selectedId) {
            this.selectCharacter(selectedId);
        } else {
            this.currentCharacter = null;
            this.updateDisplay();
        }
    }

    private selectCharacter(id: string): void {
        this.currentCharacter = this.characters.find(c => c.id === id) || null;
        this.updateDisplay();
        this.populateForm();
    }

    private renderCharacterList(): void {
        this.selectElement.innerHTML = '<option value="">Select a Character</option>';

        this.characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.id;
            option.textContent = `${character.firstName} ${character.lastName}`;
            
            if (this.currentCharacter?.id === character.id) {
                option.selected = true;
            }

            this.selectElement.appendChild(option);
        });
    }

    private populateForm(): void {
        const form = document.getElementById('user-form') as HTMLFormElement;
        if (!this.currentCharacter) {
            form.reset();
            return;
        }

        (form.elements.namedItem('firstName') as HTMLInputElement).value = this.currentCharacter.firstName;
        (form.elements.namedItem('lastName') as HTMLInputElement).value = this.currentCharacter.lastName;
        (form.elements.namedItem('age') as HTMLInputElement).value = this.currentCharacter.age?.toString() || '';
        (form.elements.namedItem('height') as HTMLInputElement).value = this.currentCharacter.height?.toString() || '';
        (form.elements.namedItem('weight') as HTMLInputElement).value = this.currentCharacter.weight?.toString() || '';
    }

    private clearDisplay(): void {
        const form = document.getElementById('user-form') as HTMLFormElement;
        form.reset();
    }

    private updateDisplay() {
        const greetingElement = document.getElementById('greeting-output');
        const infoElement = document.getElementById('user-info');
        const ageElement = document.getElementById('age-display');
        const heightElement = document.getElementById('height-display');
        const weightElement = document.getElementById('weight-display');
        
        if (!this.currentCharacter) {
            if (greetingElement) 
                greetingElement.textContent = 'No Character Selected';

            if (infoElement)
                infoElement.innerHTML = '<p>Select or Create your Character</p>';

            if (ageElement)
                ageElement.textContent = '--';

            if (heightElement)
                heightElement.textContent = '--';
            
            if (weightElement)
                weightElement.textContent = '--';
        return;
        }

        const {firstName, lastName, age, height, weight} = this.currentCharacter;

        if(greetingElement) {
            greetingElement.textContent = `Welcome, ${firstName} ${lastName}!`;
        }
        
        if(infoElement) {
            infoElement.innerHTML = `
                <h3>Character Details</h3>
                <p>${firstName} ${lastName} is ready for an adventure!</p>`;
        }

        if(ageElement) {
            ageElement.textContent = age?.toString() ?? '--';
        }

        if(heightElement) {
            heightElement.textContent = height?.toFixed(1) ?? '--';
        }

        if(weightElement) {
            weightElement.textContent = weight?.toFixed(1) ?? '--';
        }
    }
}


// Initialize form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new CharacterManager();
});
