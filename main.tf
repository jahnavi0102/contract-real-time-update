terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = "1.6.0"
    }
  }
}

provider "render" {
  api_key = var.render_api_key
  owner_id   = var.render_owner_id
}

variable "render_api_key" {
  description = "API Key for Render"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Owner ID for Render"
  type        = string
  sensitive   = true
}

resource "render_web_service" "app" {
  name        = "terraform-web-service"
  plan               = "free"
  region             = "oregon"
  start_command = "render.yaml"

runtime_source = {
    native_runtime = {
      auto_deploy   = true
      branch        = "main"
      build_command = "render.yaml"
      repo_url    = "https://github.com/jahnavi0102/contract-real-time-update"
      runtime  = "node"
    }
  }
}