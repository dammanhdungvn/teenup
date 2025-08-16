#!/bin/bash

# ========================================
# 🚀 TeenUp Contest Management System
# Universal Startup Script for Unix-like Systems
# Auto-detects environment and runs appropriate scripts
# ========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  🚀 TeenUp Contest Management System${NC}"
    echo -e "${CYAN}  🌟 Universal Control Script${NC}"
    echo -e "${CYAN}========================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to detect environment
detect_environment() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if grep -q Microsoft /proc/version 2>/dev/null; then
            echo "WSL"
        else
            echo "LINUX"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "MACOS"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
        echo "WINDOWS_BASH"
    else
        echo "UNKNOWN"
    fi
}

# Function to show environment info
show_environment_info() {
    local env_type=$(detect_environment)
    
    print_status "Detected environment: $env_type"
    
    case $env_type in
        "WSL")
            print_status "Running in Windows Subsystem for Linux"
            print_status "Will use WSL-optimized scripts"
            ;;
        "LINUX")
            print_status "Running on native Linux system"
            print_status "Will use native Linux scripts"
            ;;
        "MACOS")
            print_status "Running on macOS system"
            print_status "Will use native Unix scripts"
            ;;
        "WINDOWS_BASH")
            print_status "Running in Windows Git Bash/Cygwin"
            print_warning "Consider using teenup.bat for better Windows support"
            ;;
        *)
            print_error "Unknown environment: $OSTYPE"
            print_error "Please run the appropriate script manually"
            exit 1
            ;;
    esac
}

# Function to show available actions
show_menu() {
    echo
    echo -e "${BLUE}📋 Available Actions:${NC}"
    echo "  1) 🚀 Start system"
    echo "  2) 🛑 Stop system"
    echo "  3) 🔍 Health check"
    echo "  4) 📊 Show status"
    echo "  5) 📝 Show info"
    echo "  6) 🚪 Exit"
    echo
}

# Function to execute script based on environment and action
execute_script() {
    local action=$1
    local env_type=$(detect_environment)
    local script_name=""
    
    case $env_type in
        "WSL")
            case $action in
                "start") script_name="scripts/start-linux-wsl.sh" ;;
                "stop") script_name="scripts/stop-linux-wsl.sh" ;;
                "health") script_name="scripts/docker-healthcheck.sh" ;;
            esac
            ;;
        "LINUX"|"MACOS")
            case $action in
                "start") script_name="scripts/start-native.sh" ;;
                "stop") script_name="scripts/stop-native.sh" ;;
                "health") script_name="scripts/docker-healthcheck.sh" ;;
            esac
            ;;
        "WINDOWS_BASH")
            print_warning "Git Bash detected. Trying native scripts..."
            case $action in
                "start") script_name="scripts/start-native.sh" ;;
                "stop") script_name="scripts/stop-native.sh" ;;
                "health") script_name="scripts/docker-healthcheck.sh" ;;
            esac
            ;;
    esac
    
    if [ -z "$script_name" ]; then
        print_error "No script available for action '$action' on $env_type"
        return 1
    fi
    
    if [ ! -f "$script_name" ]; then
        print_error "Script not found: $script_name"
        return 1
    fi
    
    print_status "Executing: $script_name"
    chmod +x "$script_name" 2>/dev/null || true
    exec "$script_name"
}

# Function to show system status
show_status() {
    echo
    print_status "System Status:"
    
    # Check if docker is running
    if command -v docker &> /dev/null; then
        if docker compose ps &> /dev/null; then
            print_success "Docker Compose is available"
            echo
            docker compose ps
        else
            print_warning "Docker Compose not running or not available"
        fi
    else
        print_error "Docker not found"
    fi
    
    echo
    print_status "Available scripts:"
    ls -la scripts/ | grep -E '\.(sh|bat)$' | awk '{print "  " $9}' || true
}

# Function to show helpful information
show_info() {
    local env_type=$(detect_environment)
    
    echo
    print_status "🔧 TeenUp Management System Info"
    echo
    echo -e "${GREEN}📱 URLs (when running):${NC}"
    echo "  Frontend:    http://localhost:3000"
    echo "  Backend API: http://localhost:8081/api"
    echo "  Database:    localhost:3306"
    echo
    echo -e "${BLUE}📋 Environment:${NC} $env_type"
    echo
    echo -e "${BLUE}📁 Directory Structure:${NC}"
    echo "  scripts/     - All control scripts"
    echo "  docs/        - Documentation"
    echo "  frontend/    - React application"
    echo "  backend/     - Spring Boot application"
    echo
    echo -e "${BLUE}💡 Manual Commands:${NC}"
    case $env_type in
        "WSL")
            echo "  Start:  ./scripts/start-linux-wsl.sh"
            echo "  Stop:   ./scripts/stop-linux-wsl.sh"
            ;;
        *)
            echo "  Start:  ./scripts/start-native.sh"
            echo "  Stop:   ./scripts/stop-native.sh"
            ;;
    esac
    echo "  Health: ./scripts/docker-healthcheck.sh"
    echo
}

# Main function
main() {
    print_header
    echo
    show_environment_info
    
    # Handle command line arguments
    if [ $# -eq 1 ]; then
        case $1 in
            "start"|"run")
                execute_script "start"
                ;;
            "stop"|"down")
                execute_script "stop"
                ;;
            "health"|"check")
                execute_script "health"
                ;;
            "status"|"ps")
                show_status
                ;;
            "info"|"help")
                show_info
                ;;
            *)
                print_error "Unknown command: $1"
                show_info
                exit 1
                ;;
        esac
        return
    fi
    
    # Interactive mode
    while true; do
        show_menu
        echo -n "Please select an option (1-6): "
        read -r choice
        
        case $choice in
            1)
                execute_script "start"
                break
                ;;
            2)
                execute_script "stop"
                break
                ;;
            3)
                execute_script "health"
                break
                ;;
            4)
                show_status
                ;;
            5)
                show_info
                ;;
            6)
                print_success "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-6."
                ;;
        esac
        
        echo
        echo "Press Enter to continue..."
        read -r
    done
}

# Run main function
main "$@"
