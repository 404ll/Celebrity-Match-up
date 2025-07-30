#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据整理脚本
将原始data.json按领域分类整理到三个不同的JSON文件中
"""

import json
import os

def load_original_data():
    """加载原始数据"""
    with open('public/data/data.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def categorize_data(data):
    """按领域分类数据"""
    tech_venture = []
    politics = []
    finance_web3 = []
    
    # 科技创投领域的关键词
    tech_venture_keywords = ['科技', '创业', '创投', 'AI', '科技媒体', '加密媒体']
    
    # 政治领域的关键词
    politics_keywords = ['政治']
    
    # 金融Web3领域的关键词
    finance_web3_keywords = ['金融', 'Web3', '金融/Web3']
    
    for item in data:
        field = item.get('field', '')
        
        if field in tech_venture_keywords:
            tech_venture.append(item)
        elif field in politics_keywords:
            politics.append(item)
        elif field in finance_web3_keywords:
            finance_web3.append(item)
        else:
            # 默认归类到科技创投
            tech_venture.append(item)
    
    return tech_venture, politics, finance_web3

def save_data(data, filename):
    """保存数据到文件"""
    with open(f'public/data/{filename}', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main():
    """主函数"""
    print("开始整理数据...")
    
    # 加载原始数据
    original_data = load_original_data()
    print(f"加载了 {len(original_data)} 条数据")
    
    # 分类数据
    tech_venture, politics, finance_web3 = categorize_data(original_data)
    
    print(f"科技创投领域: {len(tech_venture)} 条")
    print(f"政治领域: {len(politics)} 条")
    print(f"金融Web3领域: {len(finance_web3)} 条")
    
    # 保存分类后的数据
    save_data(tech_venture, 'tech-venture.json')
    save_data(politics, 'politics.json')
    save_data(finance_web3, 'finance-web3.json')
    
    print("数据整理完成！")
    
    # 打印每个领域的代表人物
    print("\n科技创投领域代表人物:")
    for item in tech_venture[:5]:
        print(f"  - {item['name']} ({item['field']})")
    
    print("\n政治领域代表人物:")
    for item in politics[:5]:
        print(f"  - {item['name']} ({item['field']})")
    
    print("\n金融Web3领域代表人物:")
    for item in finance_web3[:5]:
        print(f"  - {item['name']} ({item['field']})")

if __name__ == "__main__":
    main() 