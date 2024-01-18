import xml.etree.ElementTree as ET
import sys
import yaml
import os

def parse_xml(xml_content):
    root = ET.fromstring(xml_content)
    result = {}
    themeDict = root[0]
    for index in range(0, len(themeDict), 2):
        key = themeDict[index].text
        for i in range(len(themeDict[index+1])):
            if themeDict[index+1][i].text == "Blue Component":
                blueComponent = themeDict[index+1][i+1].text
            if themeDict[index+1][i].text == "Red Component":
                redComponent = themeDict[index+1][i+1].text
            if themeDict[index+1][i].text == "Green Component":
                greenComponent = themeDict[index+1][i+1].text
        result[key] = [float(redComponent), float(greenComponent), float(blueComponent)]
    return result

def convert_rgb_to_hex(rgbArray):
    # Convert float values to integers
    rgb_integers = [int(component * 255) for component in rgbArray]
    return "#{:02x}{:02x}{:02x}".format(*rgb_integers)

def convert_to_yaml(result):
    yaml_data = {
    'accent': None,
    'details': 'darker',
    'foreground': None,
    'background': None,
    'terminal_colors': {
        'bright': {},
        'normal': {}
        }
    }
    for key in result:
        if key == "Ansi 0 Color":
            yaml_data['terminal_colors']['normal']['black'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 1 Color":
            yaml_data['terminal_colors']['normal']['red'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 10 Color":
            yaml_data['terminal_colors']['bright']['green'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 11 Color":
            yaml_data['terminal_colors']['bright']['yellow'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 12 Color":
            yaml_data['terminal_colors']['bright']['blue'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 13 Color":
            yaml_data['terminal_colors']['bright']['magenta'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 14 Color":
            yaml_data['terminal_colors']['bright']['cyan'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 15 Color":
            yaml_data['terminal_colors']['bright']['white'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 2 Color":
            yaml_data['terminal_colors']['normal']['green'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 3 Color":
            yaml_data['terminal_colors']['normal']['yellow'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 4 Color":
            yaml_data['terminal_colors']['normal']['blue'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 5 Color":
            yaml_data['terminal_colors']['normal']['magenta'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 6 Color":
            yaml_data['terminal_colors']['normal']['cyan'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 7 Color":
            yaml_data['terminal_colors']['normal']['white'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 8 Color":
            yaml_data['terminal_colors']['bright']['black'] = convert_rgb_to_hex(result[key])
        if key == "Ansi 9 Color":
            yaml_data['terminal_colors']['bright']['red'] = convert_rgb_to_hex(result[key])
        if key == "Background Color":
            yaml_data['background'] = convert_rgb_to_hex(result[key])
        if key == "Foreground Color":
            yaml_data['foreground'] = convert_rgb_to_hex(result[key])
        yaml_data['accent'] = yaml_data['foreground']
    return yaml_data

def main(txt_file_path):
    print('FUCK')
    # output_yaml_path = "~/.warp/themes"
    output_yaml_path = "/Users/jess/Projects/terminal-themes-converter/generated"
    # output_yaml_path = os.path.expanduser(output_yaml_path)  # Expand tilde to the home directory
    filename = os.path.basename(txt_file_path)
    with open(txt_file_path, 'r') as file:
        xml_content = file.read()

    result = parse_xml(xml_content)
    yaml_result = convert_to_yaml(result)

    # Change the file extension to ".yaml"
    new_file_path = os.path.join(output_yaml_path, os.path.splitext(filename)[0] + '.yaml')
    with open(new_file_path, 'w') as yaml_file:
        yaml.dump(yaml_result, yaml_file, default_flow_style=False)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py input.txt")
    else:
        input_txt_file = sys.argv[1]
        main(input_txt_file)