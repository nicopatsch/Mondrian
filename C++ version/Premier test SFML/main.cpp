//
// Disclaimer:
// ----------
//
// This code will work only if you selected window, graphics and audio.
//
// Note that the "Run Script" build phase will copy the required frameworks
// or dylibs to your application bundle so you can execute it on any OS X
// computer.
//
// Your resource files (images, sounds, fonts, ...) are also copied to your
// application bundle. To get the path to these resources, use the helper
// function `resourcePath()` from ResourcePath.hpp
//

#include <SFML/Graphics.hpp>
#include <stdlib.h>
#include <stdio.h>
#include <iostream>
#include <unistd.h>
#include <vector>
#include <math.h>
#include <cassert>







////-------- PARAMETERS --------////

int outlineThickness = 10;

const int width = 1800;
const int stepX = width / 180; //set equal to 1 to not check grid
static_assert(float(width) / float(stepX) == width / stepX, "Les stepX ne remplissent pas complètement la largeur de l'écran (width n'est pas divisible par stepX). Changez le nombre qui divise width par un diviseur de width.");

const int height = 1400;
const int stepY = height / 140; //set equal to 1 to not check grid
static_assert(float(height) / float(stepY) == height / stepY, "Les Y ne remplissent pas complètement la hauteur de l'écran (height n'est pas divisible par stepY). Changez le nombre qui divise height par un diviseur de height.");


const int freqColor = 50; //Proportion of colored rectangles in the drawing (changing at each drawing)

const int freq = 70; //Randomness parameter for the number of rectangles (the bigger freq is, the larger the number of retangles. 1 < freq < 100)
bool shouldContinueFreq(int index) {
    int p = rand() % 100;
    return (p < freq); //FREQ% chance to cut the rectangle once again
}

const int maxIndex = 5;
bool shouldContinueIndex(int index) {
    return (index <= maxIndex); //If it's more than the 10th slicing, we stop
}

bool (*myContinuationFunction) (int) = &shouldContinueIndex; // Change this function to change continuation condition



//Here, change the colors you want
sf::Color randomColor() {
    float r = (float(rand() % 100))/100.f;
    
    if(r <= 0.5) return sf::Color(246, 246, 239); //blanc
    else if(r <= 0.65) return sf::Color(29, 29, 26); //rouge
    else if(r <= 0.80) return sf::Color(250, 209, 72); //Jaune
    else if(r <= 0.95) return sf::Color(56, 73, 118); //Bleu
    else return sf::Color(193, 40, 40); //noir
    
}



////-------- END OF PARAMETERS --------////



int roundToGraduation(int i, const int grad, const int max) {
    assert(max % grad == 0);
    
    //We avoid extreme cases
    if (i - grad <= 0) return grad;
    if (i + grad >= max) return max - grad;
    
    int r = i % grad;
    if (r < (float)grad/2.f) return i - r;
    else return i - r + grad;
}

float gaussian() {
    const float sigma = 1.;
    const float mu = 0.;
    
    float x = (rand() % 1000) / 1000.f;
    const float A = 1 / (sigma * sqrt(2 * 3.1416));
    const float lambda = - 1 / (2 * sigma*sigma);
    
    return A * exp(lambda * pow(x - mu, 2));
}

float uniform() {
    return (rand() % 1000) / 1000.f;
}

float (*mySlicingLaw)() = &uniform;



void sliceRectangle(sf::RenderTexture& renderTexture, bool isVertical, int width, int height, int posx, int posy, int freqColor, int freqSlicing, bool (*continuationFunction)(int), float (*slicingLaw)(), int index = 0) {
    isVertical = !isVertical; //If we just cut vertically, now we'll do it horizontaly.
    
    if(continuationFunction(index)){
        int height1, height2, width1, width2, posx1, posx2, posy1, posy2;
        if(isVertical) { //We cut the rectangle verticaly
            
            int x = slicingLaw() * width;
            int pos = roundToGraduation(x, stepX, width);
            //std::cout << x << " -> " << pos << "(pas de " << stepX << ")" << std::endl;
            
            if (pos == 0 || pos == width) {
                throw "Boom!";
            } // should not happen by now
            
            width1 = pos;
            width2 = width - pos;
            height1 = height;
            height2 = height;
            posx1 = posx;
            posx2 = posx + pos;
            posy1 = posy;
            posy2 = posy;
            
            
        } else { //horizontaly
            
            int x = slicingLaw() * height;
            int pos = roundToGraduation(x, stepY, height);
            //std::cout << x << " -> " << pos << "(pas de " << stepY << ")" << std::endl;
            
            if (pos == 0 || pos == height) {
                throw "Boom!";
            }  // should not happen by now
            
            height1 = pos;
            height2 = height - pos;
            width1 = width;
            width2 = width;
            posx1 = posx;
            posx2 = posx;
            posy1 = posy;
            posy2 = posy + pos;
        }
        
        std::cout << posx1 << ", " << posy1 << " ; " << posx2 << ", " << posy2 << std::endl;
        if (width1>stepX & width2>stepX & height1>stepY & width2>stepY) {
            // Set the rectangles
            sf::RectangleShape rectangle1(sf::Vector2f(width1, height1));
            rectangle1.setOutlineThickness(outlineThickness);
            rectangle1.setOutlineColor(sf::Color::Black);
            rectangle1.setPosition(posx1, posy1);
            
            sf::RectangleShape rectangle2(sf::Vector2f(width2, height2));
            rectangle2.setOutlineThickness(outlineThickness);
            rectangle2.setOutlineColor(sf::Color::Black);
            rectangle2.setPosition(posx2, posy2);
            
            rectangle1.setFillColor(randomColor());
            rectangle2.setFillColor(randomColor());
            
            renderTexture.draw(rectangle1);
            renderTexture.draw(rectangle2);
            
            sliceRectangle(renderTexture, isVertical, width1, height1, posx1, posy1, freqColor, freq, continuationFunction, slicingLaw, index+1);
            sliceRectangle(renderTexture, isVertical, width2, height2, posx2, posy2, freqColor, freq, continuationFunction, slicingLaw, index+1);
        }
    }
}

int main(int, char const**)
{
    // Create the main window
    sf::RenderWindow window(sf::VideoMode(width, height), "SFML window");
    
    //Prepare the texture for rendering
    sf::RenderTexture renderTexture;
    renderTexture.create(width, height);
    renderTexture.clear();
    
    //First drawing
    sliceRectangle(renderTexture, false, width, height, 0, 0, freqColor, 100, myContinuationFunction, mySlicingLaw);
    renderTexture.display();

    const sf::Texture& texture = renderTexture.getTexture();
    sf::Sprite sprite(texture);
    
    // Start the game loop
    while (window.isOpen())
    {
        
        // Process events
        sf::Event event;
        while (window.pollEvent(event))
        {
            // Close window: exit
            if (event.type == sf::Event::Closed) {
                window.close();
            }

            // Escape pressed: exit
            if (event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Escape) {
                window.close();
            }
            if (event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Space) {
                // Clear
                renderTexture.clear();
                sliceRectangle(renderTexture, false, width, height, 0, 0, freqColor, 100, myContinuationFunction, mySlicingLaw);
                
                renderTexture.display();
                const sf::Texture& texture = renderTexture.getTexture();
                sf::Sprite sprite(texture);
                
            }
        }

        // Clear screen
        window.clear();
        
        //Draw the rendered sprite
        window.draw(sprite);
        
        // Update the window
        window.display();
    }

    return EXIT_SUCCESS;
}
