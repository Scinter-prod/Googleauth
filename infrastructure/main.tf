# ... (previous Terraform configuration)

# Cloud Run service for the backend
resource "google_cloud_run_service" "backend_service" {
  name     = "obsidian-backend"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/obsidian-backend:latest"
        env {
          name  = "MILVUS_HOST"
          value = google_compute_instance.milvus.network_interface.0.network_ip
        }
        env {
          name  = "MILVUS_PORT"
          value = "19530"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Cloud Run service for the frontend
resource "google_cloud_run_service" "frontend_service" {
  name     = "obsidian-frontend"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/obsidian-frontend:latest"
        env {
          name  = "BACKEND_URL"
          value = google_cloud_run_service.backend_service.status[0].url
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Milvus instance
resource "google_compute_instance" "milvus" {
  name         = "milvus-instance"
  machine_type = "e2-medium"
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-lts"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral IP
    }
  }

  metadata_startup_script = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo docker run -d --name milvus_standalone -p 19530:19530 -p 9091:9091 milvusdb/milvus:latest
              EOF

  tags = ["milvus"]
}

# Firewall rule to allow incoming traffic to Milvus
resource "google_compute_firewall" "milvus" {
  name    = "allow-milvus"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["19530", "9091"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["milvus"]
}

# ... (rest of the Terraform configuration)

