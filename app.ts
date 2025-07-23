// app.ts - TypeScript for a website
// Remember to activate the tsc -watch in a command prompt 

// Interface for a character
interface Character {
    id: string;
    image?: string; //Encoded in Base64
    firstName: string;
    lastName: string;
    age?: number;
    height?: number;
    weight?: number;
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
    
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
        console.log('Saving characters:', this.characters);
        localStorage.setItem('characters', JSON.stringify(this.characters));
    }

    private setupEventListeners(): void {
        document.getElementById('user-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.selectElement.addEventListener('change', () => this.handleCharacterSelect());
        this.deleteButton.addEventListener('click', () => this.deleteCurrentCharacter());
        this.clearButton.addEventListener('click', () => this.clearDisplay());
        document.getElementById('character-image')?.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    private handleImageUpload(e: Event): void {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];

        if(!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            const preview = document.getElementById('image-preview') as HTMLDivElement;

            preview.style.backgroundImage = `url(${imageData})`;


            //create a temporary character if none exists
            if (!this.currentCharacter) {
                this.currentCharacter = {
                    id: Date.now().toString(),
                    firstName: '',
                    lastName:'',
                    image: imageData,
                    str: 1,
                    dex: 1,
                    con: 1,
                    wis: 1,
                    cha: 1,
                    int: 1,
                };
            } else {
            this.currentCharacter.image = imageData;
            }
        
            // Save immediately if character has name, otherwise wait for form submit
            if (this.currentCharacter.firstName && this.currentCharacter.lastName) {
                this.saveCharacters();
            }
        };
        reader.readAsDataURL(file);
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
            str: formData.get('str') ? parseInt(formData.get('str') as string): undefined,
            dex: formData.get('dex') ? parseInt(formData.get('dex') as string): undefined,
            con: formData.get('con') ? parseInt(formData.get('con') as string): undefined,
            int: formData.get('int') ? parseInt(formData.get('int') as string): undefined,
            wis: formData.get('wis') ? parseInt(formData.get('wis') as string): undefined,
            cha: formData.get('cha') ? parseInt(formData.get('cha') as string): undefined,
            image: this.currentCharacter?.image
            };
        this.saveCharacter(characterData);
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview)
                imagePreview.style.backgroundImage = '';

        //form.reset();
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
        (form.elements.namedItem('str') as HTMLInputElement).value = this.currentCharacter.str?.toString() || '';
        (form.elements.namedItem('dex') as HTMLInputElement).value = this.currentCharacter.dex?.toString() || '';
        (form.elements.namedItem('con') as HTMLInputElement).value = this.currentCharacter.con?.toString() || '';
        (form.elements.namedItem('int') as HTMLInputElement).value = this.currentCharacter.int?.toString() || '';
        (form.elements.namedItem('wis') as HTMLInputElement).value = this.currentCharacter.wis?.toString() || '';
        (form.elements.namedItem('cha') as HTMLInputElement).value = this.currentCharacter.cha?.toString() || '';

        (document.getElementById('character-image') as HTMLInputElement).value = '';

        const preview = document.getElementById('image-preview') as HTMLDivElement;
        if (this.currentCharacter?.image) {
            preview.style.backgroundImage = `url(${this.currentCharacter.image})`;
        } else {
            preview.style.backgroundImage = '';
        }
    }

    private clearDisplay(): void {
        const form = document.getElementById('user-form') as HTMLFormElement;
        form.reset();

        const preview = document.getElementById('image-preview') as HTMLDivElement;
        preview.style.backgroundImage='';
    }

    private updateDisplay() {
        const greetingElement = document.getElementById('greeting-output');
        const imagePreview = document.getElementById('image-preview');
        const pictureCard = document.getElementById('picture-card');
        const infoElement = document.getElementById('user-info');
        const ageElement = document.getElementById('age-display');
        const heightElement = document.getElementById('height-display');
        const weightElement = document.getElementById('weight-display');
        const strengthElement = document.getElementById('str-display');
        const dexterityElement = document.getElementById('dex-display');
        const constitutionElement = document.getElementById('con-display');
        const intelligenceElement = document.getElementById('int-display');
        const wisdomElement = document.getElementById('wis-display');
        const charismaElement = document.getElementById('cha-display');

        if (!this.currentCharacter) {
            if (greetingElement) 
                greetingElement.textContent = 'No Character Selected';

            if (imagePreview)
                imagePreview.style.backgroundImage = '';

            if(pictureCard)
                pictureCard.style.backgroundImage = '';

            if (infoElement)
                infoElement.innerHTML = '<p>Select or Create your Character</p>';

            if (ageElement)
                ageElement.textContent = '--';

            if (heightElement)
                heightElement.textContent = '--';
            
            if (weightElement)
                weightElement.textContent = '--';

            if (strengthElement)
                strengthElement.textContent = '--';
            
            if (dexterityElement)
                dexterityElement.textContent = '--';

            if (constitutionElement)
                constitutionElement.textContent = '--';

            if (intelligenceElement)
                intelligenceElement.textContent = '--';

            if (wisdomElement)
                wisdomElement.textContent = '--';

            if (charismaElement)
                charismaElement.textContent = '--';

            return;
        }

        const {firstName, lastName, age, height, weight, image, str, dex, con, int, wis, cha} = this.currentCharacter;

        if(greetingElement) {
            greetingElement.textContent = `${firstName} ${lastName}!`;
        }
        
        if(infoElement) {
            infoElement.innerHTML = `
                <h3>Character Details</h3>
                <p>${firstName} ${lastName} is ready for an adventure!</p>`;
        }

        if (pictureCard) {
            pictureCard.style.backgroundImage = image ? `url(${image})` : '';
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

        if (imagePreview) {
            imagePreview.style.backgroundImage = image ? `url(${image})` : ''; 
        } 

        if(strengthElement) {
            strengthElement.textContent = str?.toString() ?? '--';
        }

        if(dexterityElement) {
            dexterityElement.textContent = dex?.toString() ?? '--';
        }

        if(constitutionElement) {
            constitutionElement.textContent = con?.toString() ?? '--';
        }

        if(intelligenceElement) {
            intelligenceElement.textContent = int?.toString() ?? '--';
        }

        if(wisdomElement) {
            wisdomElement.textContent = wis?.toString() ?? '--';
        }

        if(charismaElement) {
            charismaElement.textContent = cha?.toString() ?? '--';
        }

    }
}


// Initialize form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new CharacterManager();
});
