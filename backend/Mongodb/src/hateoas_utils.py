BASE_URL = "http://localhost:8000/subjects"

def generate_hateoas_links(subject_id: str, subject_code : str):

    return {
        "self": {"href": f"{BASE_URL}/{subject_id}"},
        "parent": {"href": BASE_URL, "method": "GET"},
        "update": {"href": f"{BASE_URL}/{subject_id}", "method": "PUT"},
        "delete": {"href": f"{BASE_URL}/{subject_id}", "method": "DELETE"},
        "get_all": {"href": BASE_URL, "method": "GET"},
        "create": {"href": BASE_URL, "method": "POST"},
        "get_by_code": {"href": f"{BASE_URL}/getByCode/{subject_code}", "method": "GET"},
        "subject_info": {"href": f"http://localhost:8080/api/academia/subjects/{subject_code}", "method": "GET"}
    }
def generate_hateoas_links_for_delete(subject_id: str, subject_code : str):

    return {
        "self": {"href": f"{BASE_URL}/{subject_id}"},
        "parent": {"href": BASE_URL, "method": "GET"},
        "get_all": {"href": BASE_URL, "method": "GET"},
        "create": {"href": BASE_URL, "method": "POST"},
        "subject_info": {"href": f"http://localhost:8080/api/academia/subjects/{subject_code}", "method": "GET"}
    }

