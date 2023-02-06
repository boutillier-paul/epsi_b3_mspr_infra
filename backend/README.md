
# epsi_b3_mspr_infra

Backend du projet MSPR infra.


## Authors

- [@Boutillier-paul](https://github.com/Boutillier-paul)
- [@Alexis-Looten](https://github.com/Alexis-Looten)


## Installation

Créer un environement virtuel et y installer les dépendances.

```bash
  python3 -m venv .venv
  source .venv/bin/activate
  pip install requirements.txt
```

## Start application

Lancer l'application.

```bash
  uvicorn app.main:app --reload
```

## Swagger

Par défault, accessible à l'adresse : http://127.0.0.1:8000/docs
    
## API Reference

### Articles

#### Get all articles

```http
  Get /articles/
```

#### Create article

```http
  Post /articles/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of the article |
| `description`      | `string` | Description of article |
| `quantity`      | `int` | **Required**. Quantity of article |

#### Get an article

```http
  Get /articles/{article_id}
```

#### Update article quantity

```http
  Put /articles/{article_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | Name of the article |
| `description`      | `string` | Description of article |
| `quantity`      | `int` | **Required**. Quantity of article |


### Orders

#### Get all orders

```http
  Get /orders/
```

#### Create order

```http
  Post /orders/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `status`      | `string` | **Required**. Status of the order |

#### Get an order

```http
  Get /orders/{order_id}
```

#### Update order status

```http
  Put /orders/{order_id}
```

#### add article to order

```http
  Put /orders/{order_id}/add/{article_id}
```