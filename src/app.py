import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QVBoxLayout, QPushButton, QLabel, QWidget, QListWidget, QStackedWidget, QHBoxLayout
)
from PyQt5.QtGui import QFont
from PyQt5.QtCore import Qt


class ModernTraderApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Trader App")
        self.setGeometry(100, 100, 600, 800)  # Set a vertical app layout for a modern look

        # Central widget with stacked layout for navigation
        self.central_widget = QStackedWidget()
        self.setCentralWidget(self.central_widget)

        # Screens
        self.home_screen = self.create_home_screen()
        self.cycap_screen = self.create_cycap_screen()

        # Add screens to the central widget
        self.central_widget.addWidget(self.home_screen)
        self.central_widget.addWidget(self.cycap_screen)

    def create_home_screen(self):
        """Create the home screen with trader buttons."""
        home_widget = QWidget()
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignCenter)

        welcome_label = QLabel("Select a Trader")
        welcome_label.setAlignment(Qt.AlignCenter)
        welcome_label.setFont(QFont("Arial", 20, QFont.Bold))
        welcome_label.setStyleSheet("color: black; text-transform: uppercase; letter-spacing: 2px;")
        layout.addWidget(welcome_label)

        # Trader buttons
        layout.addLayout(self.create_trader_button("CyCap", self.go_to_cycap))
        layout.addLayout(self.create_trader_button("Trader2", lambda: self.show_placeholder("Trader2")))
        layout.addLayout(self.create_trader_button("Trader3", lambda: self.show_placeholder("Trader3")))

        home_widget.setLayout(layout)
        return home_widget

    def create_trader_button(self, trader_name, click_action):
        """Helper to create modern trader buttons."""
        button = QPushButton(trader_name)
        button.setStyleSheet("""
            QPushButton {
                background-color: #008080; 
                color: black; 
                font-size: 18px; 
                border-radius: 10px; 
                padding: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-family: Arial, sans-serif;
            }
            QPushButton:hover {
                background-color: #00a0a0;
            }
            QPushButton:pressed {
                background-color: #004d4d;
            }
        """)
        button.clicked.connect(click_action)

        # Wrap button in a layout for spacing
        layout = QHBoxLayout()
        layout.addWidget(button)
        return layout

    def create_cycap_screen(self):
        """Create the CyCap screen showing recent trades and a green button."""
        cycap_widget = QWidget()
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignTop)

        # Top Header
        header_label = QLabel("CyCap - Recent Trades")
        header_label.setAlignment(Qt.AlignCenter)
        header_label.setFont(QFont("Arial", 20, QFont.Bold))
        header_label.setStyleSheet("color: white; text-transform: uppercase; letter-spacing: 2px;")
        layout.addWidget(header_label)

        # Green button
        connect_button = QPushButton("Follow Trader and Connect Robinhood")
        connect_button.setStyleSheet("""
            QPushButton {
                background-color: #32CD32; 
                color: black; 
                font-size: 16px; 
                border-radius: 10px; 
                padding: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-family: Arial, sans-serif;
            }
            QPushButton:hover {
                background-color: #28a428;
            }
            QPushButton:pressed {
                background-color: #228b22;
            }
        """)
        layout.addWidget(connect_button)

        # Recent trades section
        recent_trades_label = QLabel("Recent Trades")
        recent_trades_label.setFont(QFont("Arial", 16))
        recent_trades_label.setAlignment(Qt.AlignLeft)
        recent_trades_label.setStyleSheet("color: black; text-transform: uppercase; letter-spacing: 2px;")
        layout.addWidget(recent_trades_label)

        trades_list = QListWidget()
        trades = [
            "Bought AAPL @ $150.23",
            "Sold TSLA @ $703.12",
            "Bought GME @ $24.50",
            "Bought AMZN @ $123.67",
        ]
        trades_list.addItems(trades)
        trades_list.setStyleSheet("""
            QListWidget {
                font-size: 14px; 
                color: black;
                padding: 10px;
                border: 1px solid #ddd;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
            }
        """)
        layout.addWidget(trades_list)

        # Back button
        back_button = QPushButton("Back to Home")
        back_button.setStyleSheet("""
            QPushButton {
                background-color: #FF6347; 
                color: black; 
                font-size: 14px; 
                border-radius: 10px; 
                padding: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-family: Arial, sans-serif;
            }
            QPushButton:hover {
                background-color: #ff4500;
            }
            QPushButton:pressed {
                background-color: #cd3700;
            }
        """)
        back_button.clicked.connect(self.go_to_home)
        layout.addWidget(back_button)

        cycap_widget.setLayout(layout)
        return cycap_widget

    def go_to_cycap(self):
        """Navigate to the CyCap screen."""
        self.central_widget.setCurrentWidget(self.cycap_screen)

    def go_to_home(self):
        """Navigate to the home screen."""
        self.central_widget.setCurrentWidget(self.home_screen)

    def show_placeholder(self, trader_name):
        """Placeholder for other traders."""
        print(f"{trader_name} screen is under construction!")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ModernTraderApp()
    window.show()
    sys.exit(app.exec_())
