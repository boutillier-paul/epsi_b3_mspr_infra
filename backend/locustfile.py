from locust import HttpUser, between, task


class Scenario_full_task(HttpUser):
    wait_time = between(1,10)

    # nbTrainer: int = 0

    # id_trainer1: int 
    # id_trainer2: int 

    # api_id_pokemon1: int = 94
    # api_id_pokemon2: int = 32
    
    @task
    def index(self):

        # self.nbTrainer = len(self.client.get("trainers").json())

        # # Create first new player 
        # response = self.client.post("trainers/", json={"name": f"Red{self.nbTrainer+1}", "birthdate": "2022-11-11"})
        # self.id_trainer1 = response.json()["id"]

        # # Create second new player 
        # response = self.client.post("trainers/", json={"name": f"Blue{self.nbTrainer+2}", "birthdate": "2022-11-11"})
        # self.id_trainer2 = response.json()["id"]

        # # Add fisrt trainer a new pokemon
        # response = self.client.post("trainers/"+str(self.id_trainer1)+"/pokemon/", json={"api_id": self.api_id_pokemon1, "custom_name": "Ectoplasma"})

        # # Add second trainer a new pokemon
        # response = self.client.post("trainers/"+str(self.id_trainer2)+"/pokemon/", json={"api_id": self.api_id_pokemon2, "custom_name": "Nidoran"})

        # # Do a battle between both pokemons
        # response = self.client.get(f"pokemons/battle?first_poke_api_id={self.api_id_pokemon1}&second_poke_api_id={self.api_id_pokemon2}").json()
        pass