#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据整理脚本 - 优化版
将原始data.json按更细化的领域分类整理到多个JSON文件中
"""

import json
import os
from collections import defaultdict

def load_original_data():
    """加载原始数据"""
    try:
        with open('public/data/data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ 错误: 找不到 public/data/data.json 文件")
        return []
    except json.JSONDecodeError:
        print("❌ 错误: data.json 文件格式不正确")
        return []

def get_detailed_categories():
    """获取详细的分类配置 - 基于实际field值重新设计"""
    return [
        {
            'name': 'tech',
            'keywords': ['科技', 'AI', '科技媒体'],
            'description': '人工智能领域',
            'priority': 1
        },
        {
            'name': 'crypto',
            'keywords': ['Web3', '加密', '加密媒体'],
            'description': '加密区块链领域',
            'priority': 2
        },

        {
            'name': 'venture',
            'keywords': ['创业', '创投'],
            'description': '科技创业投资领域',
            'priority': 4
        },
        {
            'name': 'finance',
            'keywords': ['金融'],
            'description': '传统金融领域',
            'priority': 5
        },
        {
            'name': 'politics',
            'keywords': ['政治'],
            'description': '政治领域',
            'priority': 6
        },
        {
            'name': 'uncategorized',
            'description': '未分类',
            'priority': 7
        }
    ]

def categorize_data_detailed(data):
    """按详细分类数据 - 确保每个名人只属于一个领域"""
    categories = get_detailed_categories()
    categorized_data = defaultdict(list)
    uncategorized = []
    
    for item in data:
        field = item.get('field', '').lower()
        name = item.get('name', '')
        
        # 按优先级顺序匹配，找到第一个匹配的分类
        categorized = False
        for category in categories:
            for keyword in category['keywords']:
                if keyword.lower() in field:
                    categorized_data[category['name']].append(item)
                    categorized = True
                    print(f"🎯 {name} -> {category['name']} (匹配关键词: {keyword})")
                    break
            if categorized:
                break
        
        # 如果没有匹配到任何分类，添加到未分类
        if not categorized:
            uncategorized.append(item)
            print(f"❓ {name} -> 未分类 (field: {field})")
    
    return dict(categorized_data), uncategorized

def analyze_data_distribution(categorized_data, uncategorized):
    """分析数据分布"""
    print("\n📊 数据分布分析:")
    print("=" * 50)
    
    total_categorized = sum(len(data) for data in categorized_data.values())
    total_items = total_categorized + len(uncategorized)
    
    # 按优先级排序显示结果
    categories = get_detailed_categories()
    for category in categories:
        category_name = category['name']
        if category_name in categorized_data:
            data = categorized_data[category_name]
            percentage = (len(data) / total_items) * 100 if total_items > 0 else 0
            print(f"✅ {category_name}: {len(data)} 条 ({percentage:.1f}%) - {category['description']}")
    
    if uncategorized:
        percentage = (len(uncategorized) / total_items) * 100
        print(f"❓ 未分类: {len(uncategorized)} 条 ({percentage:.1f}%)")
    
    print("=" * 50)

def save_data_optimized(data, filename):
    """优化保存数据到文件"""
    try:
        # 确保目录存在
        os.makedirs('public/data', exist_ok=True)
        
        with open(f'public/data/{filename}', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ 已保存: {filename} ({len(data)} 条)")
    except Exception as e:
        print(f"❌ 保存 {filename} 失败: {e}")

def print_sample_data(categorized_data, uncategorized):
    """打印每个分类的样本数据"""
    print("\n👥 各领域代表人物:")
    print("=" * 50)
    
    # 按优先级排序显示
    categories = get_detailed_categories()
    for category in categories:
        category_name = category['name']
        if category_name in categorized_data and categorized_data[category_name]:
            data = categorized_data[category_name]
            print(f"\n🎯 {category_name} ({category['description']}):")
            for item in data[:3]:  # 只显示前3个
                print(f"  • {item['name']} ({item.get('field', 'N/A')})")
    
    if uncategorized:
        print(f"\n❓ 未分类样本:")
        for item in uncategorized[:5]:  # 显示前5个未分类的
            print(f"  • {item['name']} ({item.get('field', 'N/A')})")

def validate_data(data):
    """验证数据完整性"""
    print("\n🔍 数据验证:")
    print("=" * 30)
    
    required_fields = ['name', 'username', 'field', 'taste_labels']
    missing_fields = defaultdict(int)
    
    for item in data:
        for field in required_fields:
            if field not in item:
                missing_fields[field] += 1
    
    if missing_fields:
        print("⚠️  发现缺失字段:")
        for field, count in missing_fields.items():
            print(f"  - {field}: {count} 条记录缺失")
    else:
        print("✅ 所有必需字段完整")
    
    # 检查taste_labels
    empty_labels = sum(1 for item in data if not item.get('taste_labels'))
    if empty_labels:
        print(f"⚠️  {empty_labels} 条记录缺少taste_labels")

def main():
    """主函数"""
    print("🚀 开始优化数据整理...")
    print("=" * 50)
    
    # 加载原始数据
    original_data = load_original_data()
    if not original_data:
        return
    
    print(f"📥 加载了 {len(original_data)} 条数据")
    
    # 验证数据
    validate_data(original_data)
    
    # 详细分类数据
    categorized_data, uncategorized = categorize_data_detailed(original_data)
    
    # 分析数据分布
    analyze_data_distribution(categorized_data, uncategorized)
    
    # 保存分类后的数据
    print("\n💾 保存分类数据:")
    print("=" * 30)
    
    for category_name, data in categorized_data.items():
        if data:  # 只保存有数据的分类
            save_data_optimized(data, f'{category_name}.json')
    
    # 保存未分类数据（用于进一步分析）
    if uncategorized:
        save_data_optimized(uncategorized, 'uncategorized.json')
    
    # 打印样本数据
    print_sample_data(categorized_data, uncategorized)
    
    print("\n🎉 数据整理完成！")
    print("=" * 50)

if __name__ == "__main__":
    main() 